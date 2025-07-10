import type {
  AutocompleteInputProps,
  RaRecord,
  UseReferenceInputControllerParams,
} from "react-admin";
import type { Path } from "react-hook-form";
import { AutocompleteInput, ReferenceInput } from "react-admin";

export interface ReferenceSelectionProps<T extends RaRecord>
  extends AutocompleteInputProps<T, false, boolean> {
  reference: string;
  source: string;
  excludedId?: T["id"][];
  params?: Omit<UseReferenceInputControllerParams<T>, "reference" | "source">;
  labelSource?: Path<T>;
}

export function ReferenceSelection<T extends RaRecord>({
  reference,
  source,
  excludedId,
  params,
  labelSource,
  ...autocompleteProps
}: ReferenceSelectionProps<T>) {
  return (
    <ReferenceInput
      reference={reference}
      source={source}
      filter={
        excludedId
          ? {
              "id@not.in": `(${excludedId.join(",")})`,
              ...params?.filter,
            }
          : params?.filter
      }
      {...params}
    >
      <AutocompleteInput
        source={labelSource}
        variant="outlined"
        helperText={false}
        {...autocompleteProps}
      />
    </ReferenceInput>
  );
}
