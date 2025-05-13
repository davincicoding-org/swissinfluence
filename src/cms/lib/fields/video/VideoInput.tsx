import { type FunctionComponent } from "react";

import { IconMovie, type IconProps } from "@tabler/icons-react";
import { FileInput, type FileInputProps } from "react-admin";
import { useController } from "react-hook-form";
import type { VideoMedia } from "./schema";

export interface IVideoInputProps extends FileInputProps {
  PlaceholderIcon?: FunctionComponent<IconProps>;
}

export function VideoInput({
  PlaceholderIcon = IconMovie,
  sx,
  ...inputProps
}: IVideoInputProps) {
  const { field } = useController<
    Record<string, VideoMedia | undefined | null>
  >({
    name: inputProps.source,
  });

  return (
    <FileInput
      helperText={false}
      accept={{ "video/mp4": [".mp4"] }}
      sx={{
        ...sx,
        "& .RaFileInput-dropZone": {
          display: field.value ? "none" : "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.5rem",
          aspectRatio: "16 / 9",
        },
        "& .MuiBox-root": {
          display: "grid",
        },
        "& .previews": {
          display: "grid",
        },
        "&.ra-input-image": {
          marginBottom: 0,
        },
      }}
      placeholder={
        <>
          <PlaceholderIcon size="30%" stroke="4%" />
          <span>
            Drop a video file to upload,
            <br /> or click to select it.
          </span>
        </>
      }
      {...inputProps}
    >
      {field.value && (
        <video
          controls
          style={{ width: "100%" }}
          preload="none"
          src={field.value.src}
        />
      )}
    </FileInput>
  );
}
