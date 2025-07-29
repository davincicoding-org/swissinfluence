import { useMemo } from "react";
import purify from "isomorphic-dompurify";

import { cn } from "@/ui/utils";

export interface HTMLRichTextProps {
  content: string;
  className?: string;
}

export function HTMLRichText({ content, className }: HTMLRichTextProps) {
  const html = useMemo(() => {
    if (typeof content !== "string") return content;
    return purify.sanitize(content);
  }, [content]);

  return (
    <div
      className={cn("prose", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
