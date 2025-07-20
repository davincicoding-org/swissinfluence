"use server";

import type { CollectionSlug, GlobalSlug } from "payload";

import type { PublishQueue } from "@/payload-types";
import { createDependencyGraph } from "@/cms/dependency-graph";
import { revalidateCache } from "@/server/cache";
import { prefetchData } from "@/server/prefetch";

import { getPayloadClient } from "../server/payload";

export type EntityType = CollectionSlug | GlobalSlug;

/**
 * Process and delete changes, then trigger cache invalidation
 */
export async function publishChanges() {
  const payload = await getPayloadClient();

  const { docs: changesToPublish } = await payload.find({
    collection: "publish-queue",
    sort: "-updatedAt",
  });

  if (changesToPublish.length === 0) return;

  const tagsToInvalidate = new Set<EntityType>();
  const collectionChanges = new CollectionChanges();

  collectionChanges.initialize(changesToPublish);

  const graph = createDependencyGraph(payload);

  for (const change of changesToPublish) {
    // Delete the change record (it's been processed)
    await payload.delete({
      collection: "publish-queue",
      id: change.id,
    });
  }

  async function trackAffectedItems(
    collection: CollectionSlug,
    ids: string[],
    visited: Set<string>,
  ): Promise<void> {
    const dependents = graph.getDependants(collection);

    if (dependents.length === 0) return;

    for (const dependent of dependents) {
      if (dependent.entity.type === "global") {
        // This causes too many revalidations, but maybe we can skip this completely?
        tagsToInvalidate.add(dependent.entity.slug);
        continue;
      }

      if (visited.has(dependent.entity.slug)) continue;

      const { docs: affectedItems } = await payload.find({
        collection: dependent.entity.slug,
        where: {
          or: dependent.fields.map((field) => ({
            [field.field]: {
              in: ids,
            },
          })),
        },
      });

      visited.add(dependent.entity.slug);

      if (affectedItems.length === 0) continue;

      for (const item of affectedItems) {
        collectionChanges.addItem(dependent.entity.slug, item.id.toString());
      }

      return trackAffectedItems(
        dependent.entity.slug,
        affectedItems.map((item) => item.id.toString()),
        visited,
      );
    }
  }

  for (const [collection, ids] of collectionChanges.entries()) {
    await trackAffectedItems(collection, Array.from(ids), new Set<string>());
  }

  for (const entity of collectionChanges.keys()) {
    tagsToInvalidate.add(entity);
  }

  for (const tag of tagsToInvalidate) {
    await revalidateCache(tag);
  }

  await prefetchData(collectionChanges.serialize());
}

class CollectionChanges extends Map<CollectionSlug, Set<string>> {
  initialize(changes: PublishQueue[]) {
    for (const change of changes) {
      if (typeof change.entityId !== "string") continue;

      this.addItem(change.entityType as CollectionSlug, change.entityId);
    }
  }

  addItem(collection: CollectionSlug, id: string) {
    const changedIds = this.get(collection);
    if (changedIds) {
      changedIds.add(id);
    } else {
      this.set(collection, new Set([id]));
    }
  }

  serialize(): Partial<Record<CollectionSlug, string[]>> {
    const result: Partial<Record<CollectionSlug, string[]>> = {};
    for (const [collection, ids] of this.entries()) {
      result[collection] = Array.from(ids);
    }
    return result;
  }
}
