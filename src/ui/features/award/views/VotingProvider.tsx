"use client";

import type { ButtonProps } from "@mantine/core";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { isEqual } from "lodash-es";
import { useTranslations } from "next-intl";

import type { Award } from "@/payload-types";
import type { AwardCategory, InfluencerVote, VotingValues } from "@/types";

import { VotingConfirmationModal } from "./VotingConfirmationModal";
import { VotingConfirmedModal } from "./VotingConfirmedModal";
import { VotingSelectionModal } from "./VotingSelectionModal";
import { VotingSubmissionModal } from "./VotingSubmissionModal";

interface VotingContext {
  open: () => void;
}

const VotingContext = createContext<VotingContext>({
  open: () => void 0,
});

export interface VotingProviderProps {
  awardId: Award["id"] | undefined;
  categories: AwardCategory[];
  submissionHandler: (values: VotingValues) => Promise<void>;
}

export function VotingProvider({
  awardId,
  categories,
  submissionHandler,
  children,
}: PropsWithChildren<VotingProviderProps>) {
  const [votes, setVotes] = useState<VotingValues["votes"]>([]);
  const onToggleVote = (vote: InfluencerVote) =>
    setVotes((prev) =>
      prev.some((v) => isEqual(v, vote))
        ? prev.filter((v) => !isEqual(v, vote))
        : [...prev, vote],
    );
  const [isSelectionModalOpen, selectionModal] = useDisclosure(false);
  const [isSubmissionModalOpen, submissionModal] = useDisclosure(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitSelection = () => {
    setVotes(votes);
    submissionModal.open();
  };

  const handleSubmit = async (
    values: Pick<
      VotingValues,
      "firstName" | "lastName" | "email" | "newsletter"
    >,
  ) => {
    setIsSubmitting(true);
    if (awardId === undefined) return;
    await submissionHandler({
      award: awardId,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      newsletter: values.newsletter,
      votes,
    });
    setIsSubmitting(false);
    submissionModal.close();
    selectionModal.close();
    setVotes([]);
    setIsSubmitted(true);
  };

  return (
    <VotingContext.Provider
      value={{
        open: selectionModal.open,
      }}
    >
      {children}
      <VotingSelectionModal
        categories={categories}
        votes={votes}
        onToggleVote={onToggleVote}
        opened={isSelectionModalOpen}
        onClose={selectionModal.close}
        onSubmit={handleSubmitSelection}
      />
      <VotingSubmissionModal
        opened={isSubmissionModalOpen}
        isSubmitting={isSubmitting}
        onClose={submissionModal.close}
        onSubmit={handleSubmit}
      />
      <VotingConfirmationModal
        opened={isSubmitted}
        onClose={() => setIsSubmitted(false)}
      />
      <VotingConfirmedModal />
    </VotingContext.Provider>
  );
}

export function VotingButton(props: ButtonProps) {
  const t = useTranslations("award.hero");
  const { open } = useContext(VotingContext);

  return (
    <Button
      size="lg"
      radius="md"
      className="uppercase tracking-widest"
      onClick={open}
      {...props}
    >
      {t("voting.CTA")}
    </Button>
  );
}
