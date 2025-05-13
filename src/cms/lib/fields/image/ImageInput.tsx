import { type FunctionComponent, useState } from "react";
import {
  IconCrop,
  IconPhoto,
  type IconProps,
  IconX,
} from "@tabler/icons-react";
import {
  ImageField,
  type ImageInputProps,
  type ImageFieldProps,
  ImageInput as BaseImageInput,
} from "react-admin";
import Cropper from "react-easy-crop";
import type {
  IImageExtractOptions,
  IImageOptimisationOptions,
} from "./optimization/types";
import { requestImageOptimisation } from "./optimization/requestImageOptimisation";
import { useController } from "react-hook-form";
import { CircularProgress } from "@mui/material";
import {
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Toolbar,
} from "@mui/material";
import { ImageMediaSchema } from "./schema";
import { z } from "zod";

export interface IImageInputProps
  extends Omit<ImageInputProps, "multiple" | "children"> {
  PlaceholderIcon?: FunctionComponent<IconProps>;
  aspectRatio?: number;
  height?: number;
  width?: number;
  optimization?: IImageOptimisationOptions;
}

export function ImageInput({
  PlaceholderIcon = IconPhoto,
  width,
  height,
  aspectRatio,
  sx,
  accept = { "image/*": [".jpeg", ".png", ".svg", ".webp"] },
  optimization = {},
  ...inputProps
}: IImageInputProps) {
  const { field } = useController({
    name: inputProps.source,
  });

  const [loading, setLoading] = useState(false);

  const data = ImageMediaSchema.optional().nullable().parse(field.value);

  const [originalImage, setOriginalImage] = useState<{
    file: File;
    src: string;
  }>();

  const optimizeImage = async (
    file: File,
    options: IImageOptimisationOptions,
  ) => {
    setLoading(true);
    // TODO disable save while optimization is running
    const optimized = await requestImageOptimisation(file, options);

    // TODO warn if min size is no met

    // console.log({
    //   originalSize: `${(file.size / 1_000).toFixed(2)} kb`,
    //   optimizedSize: `${(optimized.file.size / 1_000).toFixed(2)} kb`,
    //   saved: `${(file.size - optimized.file.size) / 1_000}kb`,
    //   reduction: `${(100 * (1 - optimized.file.size / file.size)).toFixed(0)}%`,
    // });

    field.onChange({
      ...field.value,
      src: URL.createObjectURL(optimized.file),
      blurDataURL: optimized.blurDataURL,
      rawFile: optimized.file,
      // type: "webp",
      width: optimized.width,
      height: optimized.height,
    });
    setLoading(false);
  };

  return (
    <div
      style={{ position: "relative", display: "grid", height: "fit-content" }}
    >
      <BaseImageInput
        onChange={(event) => {
          const { data: file, success } = z.instanceof(File).safeParse(event);
          if (!success) return;

          setOriginalImage({ file, src: URL.createObjectURL(file) });

          return optimizeImage(file, optimization);
        }}
        maxSize={5_000_000}
        helperText="Maximum 5MB"
        sx={{
          ...sx,
          "& .RaFileInput-dropZone": {
            display: data ? "none" : "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
            aspectRatio: aspectRatio ?? 16 / 9,
            width,
            height,
          },
          "& .MuiBox-root": {
            display: "grid",
          },
          "& .previews": {
            display: "grid",
            gap: 1,
          },
          "&.ra-input-image": {
            marginBottom: 0,
          },
        }}
        placeholder={
          <>
            <PlaceholderIcon size="30%" stroke="4%" />
            <span>
              Drop an image to upload,
              <br /> or click to select it.
            </span>
          </>
        }
        accept={accept}
        {...inputProps}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <ImagePreview
            source="src"
            width={width}
            height={height}
            aspectRatio={aspectRatio ?? 16 / 9}
          />
        )}
      </BaseImageInput>
      {originalImage ? (
        <ImageCropper
          image={originalImage.src}
          aspectRatio={aspectRatio}
          onCrop={(extract) =>
            optimizeImage(originalImage.file, {
              ...optimization,
              extract,
            })
          }
        />
      ) : null}
    </div>
  );
}

function ImageCropper({
  image,
  aspectRatio,
  onCrop,
}: {
  image: string;
  aspectRatio: number | undefined;
  onCrop: (extraction: IImageExtractOptions) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [extraction, setExtraction] = useState<IImageExtractOptions>();

  if (aspectRatio === undefined) return null;

  return (
    <>
      <Button
        size="small"
        variant="contained"
        onClick={() => setIsOpen(true)}
        sx={{
          position: "absolute",
          bottom: "0.5rem",
          right: "0.5rem",
          minWidth: 0,
        }}
      >
        <IconCrop />
      </Button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} fullScreen>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setIsOpen(false)}
            aria-label="close"
          >
            <IconX />
          </IconButton>
          <Button
            color="primary"
            variant="outlined"
            disabled={extraction === undefined}
            sx={{ marginLeft: "auto" }}
            onClick={() => {
              if (!extraction) return;
              onCrop(extraction);
              setIsOpen(false);
            }}
          >
            Crop
          </Button>
        </Toolbar>
        <DialogContent style={{ position: "relative" }}>
          <Cropper
            image={image}
            aspect={aspectRatio}
            crop={crop}
            zoom={zoom}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, { x, y, height, width }) =>
              setExtraction({
                left: x,
                top: y,
                height,
                width,
              })
            }
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

/* Preview */

interface IImagePreviewProps extends ImageFieldProps {
  aspectRatio?: number;
  height?: number;
  width?: number;
}

export function ImagePreview({
  aspectRatio,
  height,
  width,
  sx,
  ...fieldProps
}: IImagePreviewProps) {
  return (
    <ImageField
      {...fieldProps}
      sx={{
        "& .RaImageField-image": {
          height: height ?? "auto",
          width: width ?? "100%",
          maxWidth: "300px",
          margin: 0,
          aspectRatio,
          objectFit: "cover",
          objectPosition: "center",
        },
        ...sx,
      }}
    />
  );
}
