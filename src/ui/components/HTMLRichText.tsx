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
      className={cn(
        "prose-h1:font-light prose-h2:font-light prose-h3:font-light prose-h4:font-medium prose-h5:font-medium prose-h6:font-medium prose-a:font-medium prose-a:text-mocha-500 prose-a:underline-offset-2 hover:prose-a:underline prose-strong:text-inherit prose-ol:mt-0 prose-ol:list-decimal prose-ul:mt-0 prose-ul:list-disc prose-li:marker:text-inherit [&_li>p]:my-0",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
