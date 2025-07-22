"use client";

import type { ButtonProps } from "@mantine/core";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { isEqual } from "lodash-es";
import { useTranslations } from "next-intl";

import type { Award } from "@/payload-types";
import type { AwardCategory, InfluencerVote, VotingValues } from "@/types";

import { useFlag } from "../utils";
import { VotingConfirmationModal } from "./VotingConfirmationModal";
import { VotingConfirmedModal } from "./VotingConfirmedModal";
import { VotingSelectionModal } from "./VotingSelectionModal";
import { VotingSubmissionModal } from "./VotingSubmissionModal";

interface VotingContext {
  enabled: boolean;
  open: () => void;
}

const VotingContext = createContext<VotingContext>({
  enabled: false,
  open: () => void 0,
});

export interface VotingProviderProps {
  enabled: boolean;
  awardId: Award["id"] | undefined;
  categories: AwardCategory[];
  submissionHandler: (values: VotingValues) => Promise<void>;
}

export function VotingProvider({
  enabled,
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
  const resetRef = useRef<() => void>(null);

  const enforceVoting = useFlag("ENABLE_VOTING");

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
    resetRef.current?.();
    submissionModal.close();
    selectionModal.close();
    setVotes([]);
    setIsSubmitted(true);
  };

  if (!enabled && !enforceVoting) {
    return children;
  }

  return (
    <VotingContext.Provider
      value={{
        enabled,
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
        resetRef={resetRef}
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

export const useVoting = () => useContext(VotingContext);
