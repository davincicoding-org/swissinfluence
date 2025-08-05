import { AdminErrorBoundary as AdminErrorBoundary_e5a9e14bdbe97e70ba60697217fe7688 } from "@payloadcms/plugin-sentry/client";
import {
  MetaDescriptionComponent as MetaDescriptionComponent_a8a977ebc872c5d5ea7ee689724c0860,
  MetaImageComponent as MetaImageComponent_a8a977ebc872c5d5ea7ee689724c0860,
  MetaTitleComponent as MetaTitleComponent_a8a977ebc872c5d5ea7ee689724c0860,
  OverviewComponent as OverviewComponent_a8a977ebc872c5d5ea7ee689724c0860,
  PreviewComponent as PreviewComponent_a8a977ebc872c5d5ea7ee689724c0860,
} from "@payloadcms/plugin-seo/client";
import {
  AlignFeatureClient as AlignFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  BlockquoteFeatureClient as BlockquoteFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  BoldFeatureClient as BoldFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  ChecklistFeatureClient as ChecklistFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  HeadingFeatureClient as HeadingFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  HorizontalRuleFeatureClient as HorizontalRuleFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  IndentFeatureClient as IndentFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  InlineToolbarFeatureClient as InlineToolbarFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  ItalicFeatureClient as ItalicFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  LinkFeatureClient as LinkFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  OrderedListFeatureClient as OrderedListFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  ParagraphFeatureClient as ParagraphFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  UnderlineFeatureClient as UnderlineFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  UnorderedListFeatureClient as UnorderedListFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
} from "@payloadcms/richtext-lexical/client";
import {
  LexicalDiffComponent as LexicalDiffComponent_44fe37237e0ebf4470c9990d8cb7b07e,
  RscEntryLexicalCell as RscEntryLexicalCell_44fe37237e0ebf4470c9990d8cb7b07e,
  RscEntryLexicalField as RscEntryLexicalField_44fe37237e0ebf4470c9990d8cb7b07e,
} from "@payloadcms/richtext-lexical/rsc";
import { S3ClientUploadHandler as S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24 } from "@payloadcms/storage-s3/client";
import {
  MessagesLink as MessagesLink_c6c0778e90db7bb0cd65291aef6aa70f,
  MessagesView as MessagesView_c6c0778e90db7bb0cd65291aef6aa70f,
} from "payload-polyglot/rsc";

import { default as default_1336106370b487cf0f30382e572ff5cf } from "@/cms/components/PublishButton";
import { default as default_fe12e1b97f779755da28f64d5ae3bc57 } from "@/cms/components/VotingExport";

export const importMap = {
  "@payloadcms/richtext-lexical/rsc#RscEntryLexicalCell":
    RscEntryLexicalCell_44fe37237e0ebf4470c9990d8cb7b07e,
  "@payloadcms/richtext-lexical/rsc#RscEntryLexicalField":
    RscEntryLexicalField_44fe37237e0ebf4470c9990d8cb7b07e,
  "@payloadcms/richtext-lexical/rsc#LexicalDiffComponent":
    LexicalDiffComponent_44fe37237e0ebf4470c9990d8cb7b07e,
  "@payloadcms/richtext-lexical/client#InlineToolbarFeatureClient":
    InlineToolbarFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#HorizontalRuleFeatureClient":
    HorizontalRuleFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#BlockquoteFeatureClient":
    BlockquoteFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#LinkFeatureClient":
    LinkFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#ChecklistFeatureClient":
    ChecklistFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#OrderedListFeatureClient":
    OrderedListFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#UnorderedListFeatureClient":
    UnorderedListFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#IndentFeatureClient":
    IndentFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#AlignFeatureClient":
    AlignFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#HeadingFeatureClient":
    HeadingFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#ParagraphFeatureClient":
    ParagraphFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#UnderlineFeatureClient":
    UnderlineFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#BoldFeatureClient":
    BoldFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#ItalicFeatureClient":
    ItalicFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/plugin-seo/client#OverviewComponent":
    OverviewComponent_a8a977ebc872c5d5ea7ee689724c0860,
  "@payloadcms/plugin-seo/client#MetaTitleComponent":
    MetaTitleComponent_a8a977ebc872c5d5ea7ee689724c0860,
  "@payloadcms/plugin-seo/client#MetaDescriptionComponent":
    MetaDescriptionComponent_a8a977ebc872c5d5ea7ee689724c0860,
  "@payloadcms/plugin-seo/client#MetaImageComponent":
    MetaImageComponent_a8a977ebc872c5d5ea7ee689724c0860,
  "@payloadcms/plugin-seo/client#PreviewComponent":
    PreviewComponent_a8a977ebc872c5d5ea7ee689724c0860,
  "@/cms/components/VotingExport#default":
    default_fe12e1b97f779755da28f64d5ae3bc57,
  "payload-polyglot/rsc#MessagesLink":
    MessagesLink_c6c0778e90db7bb0cd65291aef6aa70f,
  "@/cms/components/PublishButton#default":
    default_1336106370b487cf0f30382e572ff5cf,
  "@payloadcms/storage-s3/client#S3ClientUploadHandler":
    S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24,
  "@payloadcms/plugin-sentry/client#AdminErrorBoundary":
    AdminErrorBoundary_e5a9e14bdbe97e70ba60697217fe7688,
  "payload-polyglot/rsc#MessagesView":
    MessagesView_c6c0778e90db7bb0cd65291aef6aa70f,
};
