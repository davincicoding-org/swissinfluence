import { Box, Button } from "@mui/material";
import { required, TextInput } from "react-admin";

import { useController } from "react-hook-form";

import { ImageGalleryInput } from "@davincicoding/cms/media";

import type { IAwardDocument } from "./schema";

export function ImpressionsSection() {
  const { field, fieldState } = useController<IAwardDocument, "impressions">({
    name: "impressions",
  });
  if (!field.value)
    return (
      <Button type="button" onClick={() => field.onChange({})}>
        Add Impressions
      </Button>
    );

  return (
    <>
      {fieldState.invalid ? (
        <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
          <Button
            color="warning"
            type="button"
            onClick={() => field.onChange(null)}
          >
            Reset Impressions
          </Button>
        </div>
      ) : null}
      <Box style={{ flexGrow: 2, display: "grid", overflow: "hidden" }}>
        <TextInput
          label="After Movie"
          source="impressions.afterMovie"
          variant="outlined"
          validate={required("Add the link ot the after movie")}
          helperText={false}
          type="url"
          placeholder="https://youtube.com"
        />
        <ImageGalleryInput
          label="Images"
          source="impressions.images"
          validate={required("Add some images")}
          style={{
            minWidth: 0,
          }}
        />
      </Box>
    </>
  );
}
