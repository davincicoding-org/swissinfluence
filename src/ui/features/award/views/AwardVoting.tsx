"use client";

import { Button, Paper } from "@mantine/core";
import { useTranslations } from "next-intl";

import { RichText } from "@/ui/components/RichText";
import { TimeLeft } from "@/ui/components/TimeLeft";

export interface IAwardVotingProps {
  deadline: string;
}

export function AwardVoting({ deadline }: IAwardVotingProps) {
  const t = useTranslations("award.voting");

  const handleVote = () => {
    alert("VOTING NOT IMPLEMENTED");
  };

  return (
    <Paper
      withBorder
      shadow="sm"
      radius="lg"
      className="grid justify-between overflow-clip bg-neutral-200 lg:grid-cols-[auto,1fr]"
    >
      <Paper
        radius="lg"
        className="flex flex-col gap-2 bg-neutral-400 p-6 shadow-sm lg:min-w-96 lg:p-10"
      >
        <h3 className="text-4xl font-light uppercase tracking-wider sm:text-5xl md:text-6xl">
          {t("title")}
        </h3>
        <p className="text-xl uppercase md:text-2xl">
          <TimeLeft deadline={deadline} />
        </p>

        <Button
          radius="md"
          color="mocha"
          size="lg"
          className="-m-6 mt-auto uppercase max-lg:hidden"
          onClick={handleVote}
        >
          {t("CTA")}
        </Button>
      </Paper>

      <div className="grid">
        <RichText
          className="prose-lg min-w-0 max-w-full shrink px-4 py-6 leading-snug lg:px-8"
          content={String(t.raw("description"))}
        />

        <Button
          radius="md"
          color="mocha"
          size="xl"
          className="m-4 mt-0 uppercase lg:hidden"
          onClick={handleVote}
        >
          {t("CTA")}
        </Button>
      </div>
    </Paper>
  );
}
