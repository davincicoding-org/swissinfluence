"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { create } from "zustand";

import type { Award, Category, Influencer } from "@/payload-types";
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
  categories: { id: Category["id"]; nominees: Influencer["id"][] }[];
  registerCategories: (
    categories: { id: Category["id"]; nominees: Influencer["id"][] }[],
  ) => void;
  status: VotingStatus;
  setStatus: (state: VotingStatus) => void;
  openCategory: Category["id"] | undefined;
  focusedInfluencer: Influencer["id"] | undefined;
  open: (categoryId?: Category["id"]) => void;
  openVoteForMe: (influencerId: Influencer["id"]) => void;
  close: () => void;
}

const useVotingStore = create<VotingStore>((set, get) => ({
  categories: [],
  status: "idle",
  setStatus: (state) => set({ status: state }),
  openCategory: undefined,
  focusedInfluencer: undefined,
  registerCategories: (categories) => set({ categories }),
  open: (categoryId) =>
    set({
      status: "selection",
      openCategory: categoryId,
    }),
  openVoteForMe: (influencerId) =>
    set({
      status: "selection",
      focusedInfluencer: influencerId,
      openCategory: get().categories.find((category) =>
        category.nominees.some((nominee) => nominee === influencerId),
      )?.id,
    }),
  close: () =>
    set({
      status: "idle",
      openCategory: undefined,
      focusedInfluencer: undefined,
    }),
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
  const {
    registerCategories,
    setStatus: setVotingStatus,
    openCategory,
    focusedInfluencer,
    openVoteForMe,
    status: votingStatus,
    close: closeVoting,
  } = useVotingStore();

  const enforceVoting = useFlag("ENABLE_VOTING");

  const categoriesWithVoting = useMemo(() => {
    if (enforceVoting)
      return categories.filter(
        ({ voting, nominees }) => voting !== null && nominees.length > 0,
      );
    return categories.filter(canVoteInCategory);
  }, [categories, enforceVoting]);

  useEffect(() => {
    registerCategories(
      categoriesWithVoting.map(({ category, nominees }) => ({
        id: category.id,
        nominees: nominees.map((nominee) => nominee.id),
      })),
    );
  }, [categoriesWithVoting, registerCategories]);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const handleSubmit: VotingSelectionModalProps["onSubmit"] = async (
    values,
    callback,
  ) => {
    setVotingStatus("submitting");
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
    setVotingStatus("idle");
    await new Promise((resolve) => setTimeout(resolve, 300));
    setVotingStatus("submitted");
  };

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const voteForMe = searchParams.get("voteforme");
  useEffect(() => {
    if (voteForMe === null) return;
    const influencerId = Number(voteForMe);
    if (isNaN(influencerId)) return;
    openVoteForMe(influencerId);
  }, [voteForMe, openVoteForMe]);

  const handleCloseConfirmation = () => {
    router.replace(pathname);
  };

  const isSubmissionConfirmed = searchParams.get("voting-confirmed") !== null;

  return (
    <>
      <VotingSelectionModal
        categories={categoriesWithVoting}
        focusCategory={openCategory}
        focusInfluencer={focusedInfluencer}
        opened={["selection", "submission", "submitting"].includes(
          votingStatus,
        )}
        submitting={votingStatus === "submitting"}
        onClose={closeVoting}
        onSubmit={handleSubmit}
      />
      <VotingSubmissionModal
        opened={votingStatus === "submitted"}
        onClose={() => setVotingStatus("idle")}
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
    const enabled = store.categories.some(
      (category) => category.id === categoryId,
    );
    if (!enabled) return null;
    return {
      open: () => store.open(categoryId),
      isOpen: store.status !== "idle",
    };
  }, [categoryId, store]);
};
