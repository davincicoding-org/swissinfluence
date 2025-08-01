"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { create } from "zustand";

import type { Award, Category } from "@/payload-types";
import type { AwardCategory, VotingValues } from "@/types";
import { useFlag } from "@/ui/useFlag";

import type { VotingSelectionModalProps } from "./VotingSelectionModal";
import { cn } from "../utils";
import { canVoteInCategory } from "./utils";
import { VotingConfirmationModal } from "./VotingConfirmationModal";
import { VotingSelectionModal } from "./VotingSelectionModal";
import { VotingSubmissionModal } from "./VotingSubmissionModal";

type VotingStatus =
  | "idle"
  | "selection"
  | "submission"
  | "submitting"
  | "submitted";

interface VotingStore {
  categories: Category["id"][];
  registerCategories: (categories: Category["id"][]) => void;
  status: VotingStatus;
  setStatus: (state: VotingStatus) => void;
  openCategory: Category["id"] | undefined;
  open: (categoryId?: Category["id"]) => void;
  close: () => void;
}

const useVotingStore = create<VotingStore>((set) => ({
  categories: [],
  status: "idle",
  setStatus: (state) => set({ status: state }),
  openCategory: undefined,
  registerCategories: (categories) => set({ categories }),
  open: (categoryId) => set({ status: "selection", openCategory: categoryId }),
  close: () => set({ status: "idle", openCategory: undefined }),
}));

export interface VotingProps {
  awardId: Award["id"] | undefined;
  categories: AwardCategory[];
  submissionHandler: (values: VotingValues) => Promise<void>;
}

export function Voting({
  awardId,
  categories,
  submissionHandler,
}: VotingProps) {
  const store = useVotingStore();

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

  useEffect(() => {
    store.registerCategories(categoryIDs);
  }, [categoryIDs]);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const handleSubmit: VotingSelectionModalProps["onSubmit"] = async (
    values,
    callback,
  ) => {
    store.setStatus("submitting");
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
    store.setStatus("idle");
    await new Promise((resolve) => setTimeout(resolve, 300));
    store.setStatus("submitted");
  };

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleCloseConfirmation = () => {
    router.replace(pathname);
  };

  const isSubmissionConfirmed = searchParams.get("voting-confirmed") !== null;

  return (
    <>
      <VotingSelectionModal
        categories={categoriesWithVoting}
        focusCategory={store.openCategory}
        opened={["selection", "submission", "submitting"].includes(
          store.status,
        )}
        submitting={store.status === "submitting"}
        onClose={store.close}
        onSubmit={handleSubmit}
      />
      <VotingSubmissionModal
        opened={store.status === "submitted"}
        onClose={() => store.setStatus("idle")}
      />
      <VotingConfirmationModal
        key="confirmation"
        opened={isSubmissionConfirmed}
        onClose={handleCloseConfirmation}
      />
    </>
  );
}

interface VotingButtonProps {
  className?: string;
}

export function VotingButton({ className }: VotingButtonProps) {
  const t = useTranslations("award.hero");
  const store = useVotingStore();

  return (
    <button
      className={cn("btn uppercase btn-lg btn-primary", className)}
      onClick={() => store.open()}
    >
      {t("voting.CTA")}
    </button>
  );
}

export const useCategoryVoting = (categoryId: Category["id"]) => {
  const store = useVotingStore();

  return useMemo(() => {
    const enabled = store.categories.includes(categoryId);
    if (!enabled) return null;
    return {
      open: () => store.open(categoryId),
      isOpen: store.status !== "idle",
    };
  }, [categoryId, store]);
};
