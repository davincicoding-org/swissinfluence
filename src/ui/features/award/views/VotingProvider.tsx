"use client";

import type { ButtonProps } from "@mantine/core";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslations } from "next-intl";

import type { Influencer } from "@/payload-types";
import type { AwardCategory, VotingValues } from "@/types";

import { VotingSelectionModal } from "./VotingSelectionModal";
import { VotingSubmissionModal } from "./VotingSubmissionModal";

interface VotingContext {
  open: () => void;
}

const VotingContext = createContext<VotingContext>({
  open: () => void 0,
});

export interface VotingProviderProps {
  categories: AwardCategory[];
  submissionHandler: (values: VotingValues) => Promise<void>;
}

export function VotingProvider({
  categories,
  submissionHandler,
  children,
}: PropsWithChildren<VotingProviderProps>) {
  const [votes, setVotes] = useState<VotingValues["votes"]>([]);
  const onToggleVote = (id: Influencer["id"]) =>
    setVotes((prev) =>
      prev.includes(id) ? prev.filter((id) => id !== id) : [...prev, id],
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
    values: Pick<VotingValues, "email" | "newsletter">,
  ) => {
    setIsSubmitting(true);
    await submissionHandler({
      email: values.email,
      newsletter: values.newsletter,
      votes,
    });
    setIsSubmitting(false);
    submissionModal.close();
    selectionModal.close();
    setVotes([]);
    await new Promise((resolve) => setTimeout(resolve, 500));
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
      <Modal
        opened={isSubmitted}
        onClose={() => setIsSubmitted(false)}
        withCloseButton={false}
        centered
        radius="md"
        transitionProps={{
          transition: "pop",
          duration: 200,
        }}
      >
        {/* TODO i18n */}
        <p className="text-center text-2xl font-medium">
          Your votes have been submitted successfully.
        </p>
      </Modal>
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
