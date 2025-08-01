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
import { HTMLRichText } from "../components/HTMLRichText";
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
            className="!scroll-vertical h-full max-w-200 !rounded-none bg-transparent shadow-none"
            showCloseButton={false}
          >
            <DialogTitle className="sr-only">Voting Selection</DialogTitle>
            <AnimatedTabs
              defaultValue={focusCategory ?? categories[0]?.category.id}
            >
              <header className="sticky top-0 z-10 mx-auto mb-6 flex items-center justify-between gap-4 rounded-box">
                <AnimatedTabsControls
                  size="lg"
                  primary
                  initialScroll
                  className="min-w-0 flex-1 bg-base-100/50 shadow-md backdrop-blur-sm"
                  tabs={categories.map(({ category }) => ({
                    label: category.name,
                    value: category.id,
                  }))}
                />
                <DialogClose
                  data-slot="dialog-close"
                  className="btn btn-square shadow-none backdrop-blur-sm btn-xl not-hover:border-transparent not-hover:bg-base-100/50"
                >
                  <IconX stroke={1.5} />
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
                      "mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3",
                    )}
                  >
                    {nominees.map((nominee) => (
                      <PersonaCard
                        key={nominee.id}
                        role="button"
                        tabIndex={0}
                        className={cn(
                          "cursor-pointer border-2 border-base-300 transition-all",
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
                        imageSizes="700px"
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

            <AnimatePresence mode="wait">
              {votes.length > 0 && (
                <m.div
                  className="pointer-events-none sticky bottom-0 z-10 mt-8 flex justify-center *:pointer-events-auto"
                  initial={{ y: "150%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "150%" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div
                    className="flex w-84 items-center justify-between"
                    key="actions"
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
                  </div>
                </m.div>
              )}
            </AnimatePresence>
            <Disclaimer />
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

// MARK: Disclaimer

function Disclaimer() {
  const t = useTranslations("voting.selection");
  const [isAccepted, setIsAccepted] = useState(false);

  if (isAccepted) return null;

  return (
    <m.div className="sticky bottom-0 flex h-screen w-full items-center justify-center">
      <div className="max-w-sm rounded-box border border-base-300 bg-base-100/90 px-4 py-3 shadow-md backdrop-blur-sm">
        <h2 className="mb-4 text-center text-3xl leading-tight font-medium text-pretty text-primary select-none">
          {t("intro.title")}
        </h2>
        <HTMLRichText content={t.raw("intro.message")} />
        <div className="mt-4 flex justify-center">
          <button
            className="btn mx-auto btn-primary"
            onClick={() => setIsAccepted(true)}
          >
            {t.raw("intro.CTA")}
          </button>
        </div>
      </div>
    </m.div>
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
    <div className="scroll-vertical max-h-96 rounded-box bg-base-100">
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
