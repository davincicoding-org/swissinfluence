import type { ArrayInputProps } from "react-admin";
import { useMemo } from "react";
import { AddButton, Fieldset } from "@davincicoding/cms/layout";
import {
  ArrayInput,
  required,
  SelectInput,
  SimpleFormIterator,
  TextInput,
  useSimpleFormIteratorItem,
} from "react-admin";
import { useController } from "react-hook-form";

import type { SocialMedia } from "@/database/enums";
import { SocialMediaPlatformSchema } from "@/database/enums";
import { SocialMediaPlatformIcon } from "@/ui/components/SocialMediaPlatformIcon";

// MARK: Schema

export const SOCIAL_MEDIA_PLATFORM_OPTIONS = SocialMediaPlatformSchema.options;

// MARK: Choices

const SOCIAL_MEDIA_PLATFORM_CHOICES = SOCIAL_MEDIA_PLATFORM_OPTIONS.map(
  (platform) => ({
    name: (
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <SocialMediaPlatformIcon platform={platform} />
        {platform.replace(/_/, " ")}
      </span>
    ),
    id: platform,
  }),
);

// MARK: Input

export type ISocialsInputProps = Omit<ArrayInputProps, "children">;
export function SocialsInput({ fullWidth, ...inputProps }: ISocialsInputProps) {
  const { field } = useController({
    name: inputProps.source,
    defaultValue: [],
  });
  const items = field.value as Array<SocialMedia>;
  const hasAvailablePlatform = SOCIAL_MEDIA_PLATFORM_CHOICES.some(({ id }) =>
    items.every(({ platform }) => id !== platform),
  );

  return (
    <Fieldset label="Socials" fullWidth={fullWidth}>
      <ArrayInput
        helperText={false}
        label={false}
        {...inputProps}
        fullWidth={fullWidth}
      >
        <SimpleFormIterator
          inline
          disableAdd={!hasAvailablePlatform}
          addButton={<AddButton label="Add Social" size="small" />}
          sx={{
            ".RaSimpleFormIterator-line": { borderBottom: "none" },
            ".RaSimpleFormIterator-list:not(:empty)": { marginBottom: "1rem" },
          }}
          disableClear
        >
          <PlatformSelectInput items={items} />
          <TextInput
            source="url"
            variant="outlined"
            type="url"
            label="URL"
            validate={required("Add the URL to the social media profile")}
            helperText={false}
          />
        </SimpleFormIterator>
      </ArrayInput>
    </Fieldset>
  );
}

function PlatformSelectInput({ items }: { items: Array<SocialMedia> }) {
  const { index } = useSimpleFormIteratorItem();

  const choices = useMemo(() => {
    const selectedPlatform = items[index]?.platform;
    const allSelectedPlatforms = items.map(({ platform }) => platform);
    return SOCIAL_MEDIA_PLATFORM_CHOICES.filter(
      ({ id }) => id === selectedPlatform || !allSelectedPlatforms.includes(id),
    );
  }, [index, items]);

  return (
    <SelectInput
      source="platform"
      choices={choices}
      validate={required("Pick a social media platform")}
      variant="outlined"
      label="Platform"
      helperText={false}
      fullWidth={false}
      style={{ width: 175, flexShrink: 0 }}
    />
  );
}
