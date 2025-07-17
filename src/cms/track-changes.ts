import type {
  CollectionAfterChangeHook,
  CollectionSlug,
  GlobalAfterChangeHook,
  GlobalSlug,
} from "payload";

export type EntityType = CollectionSlug | GlobalSlug;

export const trackCollectionChange =
  (
    operations?: ("create" | "update")[],
  ): CollectionAfterChangeHook<{
    id: string | number;
  }> =>
  async ({ req: { payload }, doc, collection, operation }) => {
    if (operations && !operations.includes(operation as "create" | "update"))
      return;

    const entityType = collection.slug;
    const entityId = doc.id.toString();
    try {
      // Check if this entity already has a pending change
      const {
        docs: [existingChange],
      } = await payload.find({
        collection: "publish-queue",
        where: {
          and: [
            { entityType: { equals: entityType } },
            { entityId: { equals: entityId } },
          ],
        },
        limit: 1,
      });

      if (existingChange) {
        // Update existing change record
        await payload.update({
          collection: "publish-queue",
          id: existingChange.id,
          data: {
            updatedAt: new Date().toISOString(),
          },
        });
      } else {
        // Create new change record
        await payload.create({
          collection: "publish-queue",
          data: {
            entityType,
            entityId,
          },
        });
      }
    } catch (error) {
      console.error(
        `Failed to track change for ${entityType}:${entityId}`,
        error,
      );
    }
  };

export const trackGlobalChange: GlobalAfterChangeHook = async ({
  req: { payload },
  global,
}) => {
  const entityType = global.slug;

  try {
    // Check if this entity already has a pending change
    const {
      docs: [existingChange],
    } = await payload.find({
      collection: "publish-queue",
      where: {
        and: [{ entityType: { equals: entityType } }],
      },
      limit: 1,
    });

    if (existingChange) {
      // Update existing change record
      await payload.update({
        collection: "publish-queue",
        id: existingChange.id,
        data: {
          updatedAt: new Date().toISOString(),
        },
      });
    } else {
      // Create new change record
      await payload.create({
        collection: "publish-queue",
        data: {
          entityType,
        },
      });
    }
  } catch (error) {
    console.error(`Failed to track change for ${entityType}}`, error);
  }
};
