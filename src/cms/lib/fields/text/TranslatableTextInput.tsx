import { IconButton, InputAdornment, Tooltip } from "@mui/material";
import { IconLanguage } from "@tabler/icons-react";
import {
  TextInput,
  type TextInputProps,
  useTranslatableContext,
} from "react-admin";
import { useController, useWatch } from "react-hook-form";
import type { Translatable } from "./../../i18n/schema";
import { translateText } from "./../../i18n/services/deepl";
import type { TargetLocale } from "../../i18n/config";

const defaultLocale = "en";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ITranslatableTextInputProps extends TextInputProps {}

export function TranslatableTextInput({
  sx,
  ...inputProps
}: ITranslatableTextInputProps) {
  const { selectedLocale } = useTranslatableContext();
  const { field } = useController({
    name: `${inputProps.source}.${selectedLocale}`,
  });

  const translations = useWatch<Record<string, Translatable>, string>({
    name: `${inputProps.source}`,
    defaultValue: {},
  });

  // FIXME this is always equal to defaultTranslation
  const translation = field.value as string | undefined;
  const defaultTranslation = translations[defaultLocale];

  const handleTranslate = async () => {
    if (!defaultTranslation) return;
    if (!translateText) return;

    const autoTranslation = await translateText({
      text: defaultTranslation,
      sourceLocale: defaultLocale,
      targetLocale: selectedLocale as TargetLocale,
    });
    field.onChange(autoTranslation);
  };

  return (
    <TextInput
      {...inputProps}
      sx={{
        ".MuiInputBase-root": {
          paddingRight: "0.5rem",
        },
        ...sx,
      }}
      resettable
      InputProps={{
        endAdornment: (
          <Adornment
            value={translation}
            locale={selectedLocale}
            defaultValue={defaultTranslation}
            onTranslate={handleTranslate}
          />
        ),
      }}
    />
  );
}

function Adornment({
  // value,
  defaultValue,
  locale,
  onTranslate,
}: {
  value: string | undefined;
  defaultValue: string | undefined;
  locale: string;
  onTranslate: () => void;
}) {
  if (!translateText) return undefined;
  if (locale === defaultLocale) return undefined;
  // if (value) return undefined;
  if (!defaultValue) return undefined;

  return (
    <InputAdornment position="end">
      <Tooltip title={`Auto-translate from "${defaultLocale.toUpperCase()}"`}>
        <IconButton size="small" onClick={onTranslate}>
          <IconLanguage size={16} />
        </IconButton>
      </Tooltip>
    </InputAdornment>
  );
}
