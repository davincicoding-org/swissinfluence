import { IconButton, InputAdornment, Tooltip } from "@mui/material";
import { IconLanguage } from "@tabler/icons-react";
import {
  TextInput,
  type TextInputProps,
  useTranslatableContext,
} from "react-admin";
import { useController, useWatch } from "react-hook-form";

import { type SupportedLocale } from "@/i18n/config";

import { translateText } from "../services/deepl";

const DEFAULT_LANGUAGE: SupportedLocale = "en";
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
  const defaultTranslation = useWatch({
    name: `${inputProps.source}.${DEFAULT_LANGUAGE}`,
  }) as string | undefined;

  // FIXME this is always equal to defaultTranslation
  const translation = field.value as string | undefined;

  const handleTranslate = async () => {
    if (!defaultTranslation) return;

    const autoTranslation = await translateText(
      defaultTranslation,
      selectedLocale as Exclude<SupportedLocale, "en">,
    );
    field.onChange(autoTranslation);
  };

  return (
    <TextInput
      variant="outlined"
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
            locale={selectedLocale as SupportedLocale}
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
  locale: SupportedLocale;
  onTranslate: () => void;
}) {
  if (locale === DEFAULT_LANGUAGE) return undefined;
  // if (value) return undefined;
  if (!defaultValue) return undefined;

  return (
    <InputAdornment position="end">
      <Tooltip
        title={`Auto-translate from "${DEFAULT_LANGUAGE.toUpperCase()}"`}
      >
        <IconButton size="small" onClick={onTranslate}>
          <IconLanguage size={16} />
        </IconButton>
      </Tooltip>
    </InputAdornment>
  );
}
