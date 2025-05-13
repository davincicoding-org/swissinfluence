import { type CSSProperties, type FunctionComponent, useState } from "react";
import { IconPhoto, type IconProps } from "@tabler/icons-react";
import {
  ImageInput as BaseImageInput,
  type ImageInputProps,
} from "react-admin";
import type { IImageOptimisationOptions } from "./optimization/types";
import { requestImageOptimisation } from "./optimization/requestImageOptimisation";
import { useController } from "react-hook-form";
import { type ImageMedia, ImageMediaSchema } from "./schema";
import { z } from "zod";
import { CircularProgress } from "@mui/material";
import { Fieldset } from "./../../components/Fieldset";

export interface IImageGalleryInputProps
  extends Omit<ImageInputProps, "multiple" | "children"> {
  PlaceholderIcon?: FunctionComponent<IconProps>;
  height?: number;
  style?: CSSProperties;
  optimization?: IImageOptimisationOptions;
}

export function ImageGalleryInput({
  PlaceholderIcon = IconPhoto,
  height = 300,
  sx,
  style,
  accept = { "image/*": [".jpeg", ".png", ".svg", ".webp"] },
  optimization = {
    compression: "photography",
  },
  label,
  ...inputProps
}: IImageGalleryInputProps) {
  const { field } = useController<
    Record<string, Array<ImageMedia> | undefined | null>
  >({
    name: inputProps.source,
  });

  const [loading, setLoading] = useState(false);

  const data = z
    .array(ImageMediaSchema)
    .optional()
    .nullable()
    .parse(field.value);

  return (
    <Fieldset legend={label} style={style}>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          overflowX: "auto",
          overscrollBehaviorX: "contain",
        }}
      >
        {data?.map((image, index) => (
          <div key={image.src} style={{ position: "relative" }}>
            <button
              type="button"
              style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.5rem",
              }}
              onClick={() =>
                field.onChange(
                  (field.value ?? []).filter(
                    (_, entryIndex) => entryIndex !== index,
                  ),
                )
              }
            >
              X
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img
              src={image.src}
              style={{
                height,
                width: "auto",
              }}
            />
          </div>
        ))}
        <BaseImageInput
          multiple
          helperText={false}
          onChange={async (event) => {
            const { data: items, success } = z
              .array(z.union([ImageMediaSchema, z.instanceof(File)]))
              .safeParse(event);
            if (!success) return;

            // TODO disable save while optimization is running
            setLoading(true);

            for (const [_, image] of items.entries()) {
              if (!(image instanceof File)) continue;
              const optimized = await requestImageOptimisation(
                image,
                optimization,
              );

              field.onChange([
                ...(field.value ?? []),
                {
                  src: URL.createObjectURL(optimized.file),
                  blurDataURL: optimized.blurDataURL,
                  rawFile: optimized.file,
                  width: optimized.width,
                  height: optimized.height,
                },
              ]);
            }

            setLoading(false);
          }}
          sx={{
            ...sx,
            "& .RaFileInput-dropZone": {
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              aspectRatio: "16 / 9",
              gap: "0.5rem",
              height,
            },
            "& .MuiBox-root": {
              display: "grid",
            },
            "&.ra-input-image": {
              marginBottom: 0,
            },
          }}
          placeholder={
            loading ? (
              <CircularProgress />
            ) : (
              <>
                <PlaceholderIcon size="30%" stroke="4%" />
                <span>
                  Drop images to upload,
                  <br /> or click to select them.
                </span>
              </>
            )
          }
          accept={accept}
          label={false}
          {...inputProps}
        />
      </div>
    </Fieldset>
  );
}
