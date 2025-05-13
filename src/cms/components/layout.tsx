import {
  type CSSProperties,
  type PropsWithChildren,
  type ReactNode,
} from "react";

import { Avatar, InputLabel } from "@mui/material";

import { type ImageMedia } from "../lib/fields";

/* Fieldset */

export interface IFieldsetProps {
  legend: ReactNode;
  fullWidth?: boolean;
  style?: CSSProperties;
}
export function Fieldset({
  legend,
  fullWidth,
  children,
  style,
}: PropsWithChildren<IFieldsetProps>) {
  return (
    <fieldset
      style={{
        borderRadius: "0.5rem",
        borderStyle: "solid",
        borderColor: "#363636",
        width: fullWidth ? "100%" : undefined,
        ...style,
      }}
    >
      <legend>
        {typeof legend === "string" ? (
          <InputLabel>{legend}</InputLabel>
        ) : (
          legend
        )}
      </legend>
      {children}
    </fieldset>
  );
}

/* Avatar */

export interface IImageAvatarProps {
  image: ImageMedia | null;
}
export function ImageAvatar({ image }: IImageAvatarProps) {
  return <Avatar src={image?.src} />;
}
