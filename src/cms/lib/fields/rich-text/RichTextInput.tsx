import {
  AlignmentButtons,
  ClearButtons,
  FormatButtons,
  LevelSelect,
  LinkButtons,
  ListButtons,
  RichTextInput as BaseInput,
  type RichTextInputProps,
  RichTextInputToolbar,
} from "ra-input-rich-text";
import { useTranslatableContext } from "react-admin";
import { useController } from "react-hook-form";

export interface IRichTextInputProps
  extends Omit<RichTextInputProps, "toolbar"> {
  size?: "small" | "medium" | "large";
}

export function RichTextInput({ size, ...inputProps }: IRichTextInputProps) {
  const { selectedLocale } = useTranslatableContext();
  const { field } = useController({
    name: `${inputProps.source}.${selectedLocale}`,
  });

  return (
    <BaseInput
      {...inputProps}
      toolbar={
        <RichTextInputToolbar>
          <LevelSelect size={size} />
          <FormatButtons size={size} />
          <AlignmentButtons size={size} />
          <ListButtons size={size} />
          <LinkButtons size={size} />
          <ClearButtons size={size} />
        </RichTextInputToolbar>
      }
      onChange={(value) => {
        inputProps.onChange?.(value);
        field.onChange(String(value).replace(/<br>/g, "<br/>"));
      }}
    />
  );
}
