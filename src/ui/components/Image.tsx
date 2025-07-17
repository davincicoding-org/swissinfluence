"use client";

import NextImage from "next/image";

import type { Logo, Photo, ProfilePicture } from "@/payload-types";

import { cn } from "../utils";

export interface ImageProps {
  resource: Photo | ProfilePicture | Logo;
  alt?: string;
  className?: string;
  fill?: boolean;
  imgClassName?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
  sizes?: string;
  // onLoad?: () => void;
  // onClick?: () => void;
}

export function Image({
  resource,
  alt,
  className,
  fill,
  loading,
  priority,
  sizes,
  imgClassName,
}: ImageProps) {
  // const [isLoaded, setIsLoaded] = useState(false);

  // const handleImageLoad = () => {
  //   console.log("Image loaded successfully");
  //   setIsLoaded(true);
  // };

  // const handleImageError = () => {
  //   console.error("Image failed to load");
  //   console.log("Image URL:", resource.url);
  // };

  return (
    <picture className={cn("relative block overflow-hidden", className)}>
      {/* Actual image */}
      <NextImage
        src={resource.url ?? ""}
        alt={alt ?? ("alt" in resource ? (resource.alt ?? "") : "")}
        className={cn("block h-full w-full object-cover", imgClassName)}
        style={{
          objectPosition: `${resource.focalX ?? 50}% ${resource.focalY ?? 50}%`,
        }}
        fill={fill}
        height={!fill ? (resource.height ?? undefined) : undefined}
        priority={priority}
        quality={100}
        loading={loading}
        width={!fill ? (resource.width ?? undefined) : undefined}
        sizes={sizes}
        // onLoad={handleImageLoad}
        // onError={handleImageError}
      />

      {/* Blurhash placeholder */}
      {/* {resource.blurhash && (
        <Blurhash
          hash={resource.blurhash}
          width="100%"
          height="100%"
          resolutionX={32}
          resolutionY={32}
          punch={1}
          className={cn(
            "absolute inset-0 z-10 object-cover transition-opacity duration-300 ease-in-out",
            isLoaded ? "opacity-0" : "opacity-100",
          )}
          style={{
            objectPosition: `${resource.focalX ?? 50}% ${resource.focalY ?? 50}%`,
          }}
        />
      )} */}
    </picture>
  );
}
