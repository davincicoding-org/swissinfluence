import {
  AlignmentButtons,
  ClearButtons,
  FormatButtons,
  LevelSelect,
  LinkButtons,
  ListButtons,
  RichTextInput,
  type RichTextInputProps,
  RichTextInputToolbar,
} from "ra-input-rich-text";
import { useTranslatableContext } from "react-admin";
import { useController } from "react-hook-form";

export interface ICustomRichTextInputProps
  extends Omit<RichTextInputProps, "toolbar"> {
  size?: "small" | "medium" | "large";
}

export function CustomRichTextInput({
  size,
  ...inputProps
}: ICustomRichTextInputProps) {
  const { selectedLocale } = useTranslatableContext();
  const { field } = useController({
    name: `${inputProps.source}.${selectedLocale}`,
  });

  return (
    <RichTextInput
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
        function removeStyleAttributes(htmlString: string) {
          // Parse the HTML string into a DOM structure
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlString, "text/html");

          // Select all elements with a style attribute and remove the attribute
          doc.querySelectorAll("[style]").forEach((element) => {
            element.removeAttribute("style");
          });

          // Remove span elements with no attributes
          doc.querySelectorAll("span").forEach((span) => {
            if (!span.attributes.length) {
              span.replaceWith(...span.childNodes);
            }
          });

          // Serialize the cleaned HTML back to a string
          return doc.body.innerHTML;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        field.onChange(removeStyleAttributes(value).replace(/<br>/g, "<br/>"));
      }}
    />
  );
}
