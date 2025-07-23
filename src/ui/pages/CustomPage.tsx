import type { RichTextProps } from "../components/RichText";
import { RichText } from "../components/RichText";

export interface CustomPageProps {
  title: string;
  content: RichTextProps["data"];
}

export function CustomPage({ title, content }: CustomPageProps) {
  return (
    <main className="container min-h-screen pb-20 pt-32">
      <h1 className="mb-8 text-4xl">{title}</h1>
      <RichText className="prose-lg max-w-none" data={content} />
    </main>
  );
}
