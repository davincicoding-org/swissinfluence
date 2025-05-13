import { NextResponse } from "next/server";

import type {
  Messages,
  MessagesContent,
  MessagesGroup,
  MessagesGroupContent,
  MessagesScope,
  MessagesScopeContent,
  MessagesSection,
  MessagesSectionContent,
} from "./../../messages/schema";
import type { MediaFetcher } from "./../../media/config";
import type { Translatable } from "./../../i18n/schema";
import { TranslatableSchema } from "./../../i18n/schema";

export const getMedia = async ({
  fetchMedia,
}: {
  fetchMedia: MediaFetcher;
}) => {
  const content = await fetchMedia();
  return NextResponse.json(content, { status: 200 });
};

/* Utils */

const isTranslatable = (data: unknown): data is Translatable =>
  TranslatableSchema.safeParse(data).success;

export function resolveMessages(
  content: MessagesContent,
  locale: string,
): Messages {
  return Object.entries(content).reduce<Messages>(
    (acc, [scope, messages]) => ({
      ...acc,
      [scope]: resolveMessagesScope(messages, locale, scope),
    }),
    {},
  );
}

export function resolveMessagesScope(
  content: MessagesScopeContent,
  locale: string,
  scope: string,
): MessagesScope {
  return Object.entries(content).reduce<MessagesScope>(
    (acc, [key, messages]) => {
      const keyPath = [scope, key];

      if (isTranslatable(messages))
        return {
          ...acc,
          [key]: messages[locale] ?? `[${keyPath.join(".")}]`,
        };

      return {
        ...acc,
        [key]: resolveMessagesSection(messages, locale, keyPath),
      };
    },
    {},
  );
}

export function resolveMessagesSection(
  content: MessagesSectionContent,
  locale: string,
  path: Array<string>,
): MessagesSection {
  return Object.entries(content).reduce<MessagesSection>(
    (acc, [key, messages]) => {
      const keyPath = [...path, key];

      if (isTranslatable(messages))
        return {
          ...acc,
          [key]: messages[locale] ?? `[${keyPath.join(".")}]`,
        };

      return {
        ...acc,
        [key]: resolveMessagesGroup(messages, locale, keyPath),
      };
    },
    {},
  );
}

export function resolveMessagesGroup(
  content: MessagesGroupContent,
  locale: string,
  path: Array<string>,
): MessagesGroup {
  return Object.entries(content).reduce<MessagesGroup>(
    (acc, [key, messages]) => ({
      ...acc,
      [key]: messages[locale] ?? `[${[...path, key].join(".")}]`,
    }),
    {},
  );
}
