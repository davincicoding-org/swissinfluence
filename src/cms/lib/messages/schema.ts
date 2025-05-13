import { z } from "zod";
import { DocumentIDSchema } from "../database/schema";
import { TranslatableSchema } from "../i18n/schema";

const MessageTypeSchema = z.enum(["text", "rich-text"]);

/* Content */

export const MessagesGroupContentSchema = z.lazy(() =>
  z.record(TranslatableSchema),
);
export type MessagesGroupContent = z.infer<typeof MessagesGroupContentSchema>;

export const MessagesSectionContentSchema = z.lazy(() =>
  z.record(z.union([MessagesGroupContentSchema, TranslatableSchema])),
);
export type MessagesSectionContent = z.infer<
  typeof MessagesSectionContentSchema
>;

export const MessagesScopeContentSchema = z.lazy(() =>
  z.record(
    z.union([
      MessagesSectionContentSchema,
      MessagesGroupContentSchema,
      TranslatableSchema,
    ]),
  ),
);
export type MessagesScopeContent = z.infer<typeof MessagesScopeContentSchema>;

export const MessagesContentSchema = z.lazy(() =>
  z.record(MessagesScopeContentSchema),
);
export type MessagesContent = z.infer<typeof MessagesContentSchema>;

/* Config */

const MessageConfigSchema = z.object({
  key: z.string(),
  type: MessageTypeSchema,
});
export type MessageConfig = z.infer<typeof MessageConfigSchema>;

const MessagesGroupConfigSchema = z.object({
  key: z.string(),
  type: z.enum(["group"]),
  messages: z.array(MessageConfigSchema),
});
export type MessagesGroupConfig = z.infer<typeof MessagesGroupConfigSchema>;

const MessagesSectionConfigSchema = z.object({
  key: z.string(),
  type: z.enum(["section"]),
  messages: z.array(z.union([MessagesGroupConfigSchema, MessageConfigSchema])),
});
export type MessagesSectionConfig = z.infer<typeof MessagesSectionConfigSchema>;

const MessagesScopeConfigSchema = z.array(
  z.union([
    MessagesSectionConfigSchema,
    MessagesGroupConfigSchema,
    MessageConfigSchema,
  ]),
);
export type MessagesScopeConfig = z.infer<typeof MessagesScopeConfigSchema>;

/* Messages */

const MessageSchema = z.string();
const MessagesGroupSchema = z.record(z.string());
export type MessagesGroup = z.infer<typeof MessagesGroupSchema>;

const MessagesSectionSchema = z.record(
  z.union([MessagesGroupSchema, MessageSchema]),
);
export type MessagesSection = z.infer<typeof MessagesSectionSchema>;

const MessagesScopeSchema = z.record(
  z.union([MessagesSectionSchema, MessagesGroupSchema, MessageSchema]),
);

export type MessagesScope = z.infer<typeof MessagesScopeSchema>;

export const MessagesSchema = z.record(MessagesScopeSchema);
export type Messages = z.infer<typeof MessagesSchema>;

/* Document */

export const MessagesDocumentSchema = z.object({
  id: DocumentIDSchema,
  messages: MessagesScopeContentSchema,
  config: MessagesScopeConfigSchema,
});

export type MessagesDocument = z.infer<typeof MessagesDocumentSchema>;
