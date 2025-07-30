"use client";

import { useMemo, useState } from "react";
import { IconList, IconRestore, IconX } from "@tabler/icons-react";
import { isEqual } from "lodash-es";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useTranslations } from "next-intl";

import type { Category } from "@/payload-types";
import type {
  AwardCategory,
  Influencer,
  InfluencerVote,
  VotingValues,
} from "@/types";
import { Image } from "@/ui/components/Image";
import { PersonaCard } from "@/ui/components/PersonaCard";
import { cn } from "@/ui/utils";

import type { VotingSubmissionFormProps } from "./VotingSubmissionForm";
import {
  AnimatedTabs,
  AnimatedTabsControls,
  AnimatedTabsPanel,
} from "../components/AnimatedTabs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "../components/Dialog";
import { VotingSubmissionForm } from "./VotingSubmissionForm";

export interface VotingSelectionModalProps {
  categories: AwardCategory[];
  focusCategory?: Category["id"];
  submitting: boolean;
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<VotingValues, "award">, callback: () => void) => void;
}

interface CategorySelection {
  category: Pick<Category, "id" | "name">;
  influencers: Array<Influencer>;
}

export function VotingSelectionModal({
  categories,
  focusCategory,
  submitting,
  opened,
  onClose,
  onSubmit,
}: VotingSelectionModalProps) {
  const t = useTranslations("voting.selection");

  const [votes, setVotes] = useState<VotingValues["votes"]>([]);
  const onToggleVote = (vote: InfluencerVote) =>
    setVotes((prev) =>
      prev.some((v) => isEqual(v, vote))
        ? prev.filter((v) => !isEqual(v, vote))
        : [...prev, vote],
    );

  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);

  const selection = useMemo<CategorySelection[]>(
    () =>
      categories
        .map(({ nominees, category }) => ({
          category,
          influencers: nominees.filter((nominee) =>
            votes.some((vote) =>
              isEqual(vote, { influencer: nominee.id, category: category.id }),
            ),
          ),
        }))
        .filter(({ influencers }) => influencers.length > 0),
    [categories, votes],
  );

  const handleReset = () => setVotes([]);
  const handleSubmit: VotingSubmissionFormProps["onSubmit"] = (
    values,
    callback,
  ) =>
    onSubmit({ ...values, votes }, () => {
      setVotes([]);
      callback();
      setIsSubmissionOpen(false);
      onClose();
    });

  return (
    <>
      <Dialog modal open={opened} onOpenChange={onClose}>
        <form>
          <DialogContent
            className="flex h-screen w-screen flex-col gap-8 overflow-y-auto bg-transparent backdrop-blur-md"
            withOverlay={false}
            showCloseButton={false}
            fullScreen
          >
            <AnimatedTabs defaultValue={focusCategory}>
              <DialogTitle className="sr-only">Voting Selection</DialogTitle>

              <header className="sticky top-0 z-10 flex min-w-0 gap-3">
                <AnimatedTabsControls
                  size="lg"
                  primary
                  initialScroll
                  className="min-w-0 overflow-x-auto shadow-md"
                  tabs={categories.map(({ category }) => ({
                    label: category.name,
                    value: category.id,
                  }))}
                />
                <DialogClose
                  data-slot="dialog-close"
                  className="btn btn-square shadow-none backdrop-blur-xs btn-xl not-hover:border-transparent not-hover:bg-white/20"
                >
                  <IconX />
                  <span className="sr-only">Close</span>
                </DialogClose>
              </header>

              {categories.map(({ category, nominees }) => (
                <AnimatedTabsPanel
                  key={category.id}
                  value={category.id}
                  className="my-auto min-w-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <div
                    className={cn(
                      "mx-auto grid max-w-280 cols-autofill-250 gap-6",
                    )}
                  >
                    {nominees.map((nominee) => (
                      <PersonaCard
                        key={nominee.id}
                        role="button"
                        tabIndex={0}
                        className={cn(
                          "cursor-pointer transition-all active:scale-95",
                          {
                            "border-8 border-primary": votes.some((vote) =>
                              isEqual(vote, {
                                influencer: nominee.id,
                                category: category.id,
                              }),
                            ),
                          },
                        )}
                        socials={nominee.socials ?? []}
                        name={nominee.name}
                        image={nominee.image}
                        imageSizes="500px"
                        onClick={() =>
                          onToggleVote({
                            influencer: nominee.id,
                            category: category.id,
                          })
                        }
                        onSocialClick={(e) => e.stopPropagation()}
                      />
                    ))}
                  </div>
                </AnimatedTabsPanel>
              ))}
            </AnimatedTabs>

            <div className="pointer-events-none sticky bottom-0 z-10 flex justify-center p-3 pt-0 *:pointer-events-auto">
              <AnimatePresence mode="wait">
                {votes.length > 0 ? (
                  <m.div
                    className="flex w-84 items-center justify-between"
                    key="actions"
                    initial={{ y: "150%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "150%" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="tooltip" data-tip={t("reset")}>
                      <button
                        className="btn btn-square bg-white/50 backdrop-blur-xs btn-lg"
                        onClick={handleReset}
                      >
                        <IconRestore stroke={1.5} />
                      </button>
                    </div>
                    <button
                      key="submit"
                      className="btn shrink uppercase btn-lg btn-primary"
                      onClick={() => setIsSubmissionOpen(true)}
                    >
                      {t("submit")}
                    </button>

                    <div className="indicator">
                      <span className="indicator-item pointer-events-none badge badge-primary">
                        {votes.length}
                      </span>
                      <div className="dropdown-hover dropdown dropdown-end dropdown-top">
                        <button className="btn btn-square bg-white/50 backdrop-blur-xs btn-lg">
                          <IconList stroke={1.5} />
                        </button>
                        <div className="dropdown-content w-84 pb-6">
                          <SelectionList
                            selection={selection}
                            onRemove={onToggleVote}
                          />
                        </div>
                      </div>
                    </div>
                  </m.div>
                ) : (
                  <m.div
                    key="info"
                    className="border-base rounded-box border bg-base-100/70 px-4 py-3 shadow-sm backdrop-blur-xs"
                    initial={{ y: "150%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "150%" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <p className="text-mocha-800 text-lg leading-tight font-medium text-pretty select-none">
                      {t("instructions")}
                    </p>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </DialogContent>
        </form>
      </Dialog>

      <Dialog
        open={isSubmissionOpen}
        onOpenChange={() => setIsSubmissionOpen(false)}
      >
        <form>
          <DialogContent className="max-w-sm p-0" showCloseButton={false}>
            <DialogTitle className="sr-only">Voting Submission</DialogTitle>
            <VotingSubmissionForm
              isSubmitting={submitting}
              onSubmit={handleSubmit}
              onCancel={() => setIsSubmissionOpen(false)}
            />
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}

// MARK: Selection List

function SelectionList({
  selection,
  onRemove,
}: {
  selection: CategorySelection[];
  onRemove: (params: {
    category: Category["id"];
    influencer: Influencer["id"];
  }) => void;
}) {
  return (
    <div className="max-h-96 overflow-y-auto rounded-box bg-base-100">
      <AnimatePresence>
        {selection.map(({ category, influencers }) => (
          <m.ul
            key={`category-${category.id}`}
            className="list"
            exit={{ opacity: 0, x: 10 }}
          >
            <m.li
              key={category.id}
              className="sticky top-0 z-10 mb-1 border-y border-base-300 bg-base-300/30 p-4 pt-2 pb-2 text-xl font-medium tracking-wide shadow-sm backdrop-blur-xs"
            >
              {category.name}
            </m.li>
            <AnimatePresence>
              {influencers.map((influencer) => (
                <m.li
                  key={influencer.id}
                  className="mx-2 mt-2 flex gap-3 overflow-clip rounded-lg border border-base-300 pr-1 shadow-sm last:mb-4"
                  exit={{ opacity: 0, x: 10 }}
                >
                  <Image
                    resource={influencer.image}
                    alt={influencer.name}
                    className="size-12 shrink-0"
                    sizes="80px"
                  />
                  <p className="my-auto grow text-lg leading-tight text-pretty">
                    {influencer.name}
                  </p>
                  <button
                    className="btn my-auto btn-square shrink-0 btn-ghost"
                    onClick={() =>
                      onRemove({
                        category: category.id,
                        influencer: influencer.id,
                      })
                    }
                  >
                    <IconX stroke={1.5} />
                  </button>
                </m.li>
              ))}
            </AnimatePresence>
          </m.ul>
        ))}
      </AnimatePresence>
    </div>
  );
}
