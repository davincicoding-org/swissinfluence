"use client";

import type { ButtonProps } from "@mantine/core";
import type { PropsWithChildren } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { isEqual } from "lodash-es";
import { useTranslations } from "next-intl";

import type { Award, Category } from "@/payload-types";
import type { AwardCategory, InfluencerVote, VotingValues } from "@/types";
import { useFlag } from "@/ui/useFlag";

import { canVoteInCategory } from "./utils";
import { VotingConfirmationModal } from "./VotingConfirmationModal";
import { VotingConfirmedModal } from "./VotingConfirmedModal";
import { VotingSelectionModal } from "./VotingSelectionModal";
import { VotingSubmissionModal } from "./VotingSubmissionModal";

interface VotingContext {
  categories: Category["id"][];
  open: (categoryId?: Category["id"]) => void;
}

const VotingContext = createContext<VotingContext>({
  categories: [],
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
  const [openCategory, setOpenCategory] = useState<Category["id"]>();
  const [isSelectionModalOpen, selectionModal] = useDisclosure(false);
  const [isSubmissionModalOpen, submissionModal] = useDisclosure(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const resetRef = useRef<() => void>(null);

  const enforceVoting = useFlag("ENABLE_VOTING");

  const categoriesWithVoting = useMemo(() => {
    if (enforceVoting) return categories;
    return categories.filter(canVoteInCategory);
  }, [categories, enforceVoting]);

  const categoryIDs = useMemo(
    () => categoriesWithVoting.map(({ category }) => category.id),
    [categoriesWithVoting],
  );

  const handleOpenVotingSelection = useCallback(
    (categoryId?: Category["id"]) => {
      setOpenCategory(categoryId);
      selectionModal.open();
    },
    [selectionModal],
  );

  const handleCloseVotingSelection = useCallback(() => {
    setOpenCategory(undefined);
    selectionModal.close();
  }, [selectionModal]);

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
    handleCloseVotingSelection();
    setVotes([]);
    setIsSubmitted(true);
  };

  if (categoriesWithVoting.length === 0) return children;

  return (
    <VotingContext.Provider
      value={{
        categories: categoryIDs,
        open: handleOpenVotingSelection,
      }}
    >
      {children}
      <VotingSelectionModal
        categories={categoriesWithVoting}
        focusCategory={openCategory}
        votes={votes}
        onToggleVote={onToggleVote}
        opened={isSelectionModalOpen}
        onClose={handleCloseVotingSelection}
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
      onClick={() => open()}
      {...props}
    >
      {t("voting.CTA")}
    </Button>
  );
}

export const useCategoryVoting = (categoryId: Category["id"]) => {
  const { open, categories } = useContext(VotingContext);

  return useMemo(() => {
    const enabled = categories.includes(categoryId);
    if (!enabled) return null;

    return {
      open: () => open(categoryId),
    };
  }, [categories, categoryId, open]);
};
