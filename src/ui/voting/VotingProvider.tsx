"use client";

import type { ButtonProps } from "@mantine/core";
import type { PropsWithChildren } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslations } from "next-intl";

import type { Award, Category } from "@/payload-types";
import type { AwardCategory, VotingValues } from "@/types";
import { useFlag } from "@/ui/useFlag";

import type { VotingSelectionModalProps } from "./VotingSelectionModal";
import { canVoteInCategory } from "./utils";
import { VotingConfirmationModal } from "./VotingConfirmationModal";
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
  const [openCategory, setOpenCategory] = useState<Category["id"]>();
  const [isSelectionModalOpen, selectionModal] = useDisclosure(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const enforceVoting = useFlag("ENABLE_VOTING");

  const categoriesWithVoting = useMemo(() => {
    if (enforceVoting)
      return categories.filter(
        ({ voting, nominees }) => voting !== null && nominees.length > 0,
      );
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

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const handleSubmit: VotingSelectionModalProps["onSubmit"] = async (
    values,
    callback,
  ) => {
    setIsSubmitting(true);
    if (awardId === undefined) return;
    await submissionHandler({
      award: awardId,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      newsletter: values.newsletter,
      votes: values.votes,
    });
    callback();
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const handleCloseConfirmation = () => {
    router.replace(pathname);
  };

  const isSubmissionConfirmed = searchParams.get("voting-confirmed") !== null;

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
        opened={isSelectionModalOpen}
        submitting={isSubmitting}
        onClose={handleCloseVotingSelection}
        onSubmit={handleSubmit}
      />
      <VotingSubmissionModal
        opened={isSubmitted}
        onClose={() => setIsSubmitted(false)}
      />
      <VotingConfirmationModal
        opened={isSubmissionConfirmed}
        onClose={handleCloseConfirmation}
      />
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
