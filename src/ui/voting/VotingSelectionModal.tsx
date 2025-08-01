"use client";

import { useMemo, useRef, useState } from "react";
import { IconList, IconX } from "@tabler/icons-react";
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
  const scrollRef = useRef<HTMLDivElement>(null);
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

  const handleTabChange = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <>
      <Dialog modal open={opened} onOpenChange={onClose}>
        <form>
          <DialogContent
            className="!scroll-vertical h-full max-w-192 !rounded-none bg-transparent p-0 shadow-none"
            showCloseButton={false}
            overlayClassName="bg-black/80"
            ref={scrollRef}
          >
            <DialogTitle className="sr-only">Voting Selection</DialogTitle>
            <AnimatedTabs
              defaultValue={focusCategory ?? categories[0]?.category.id}
            >
              {categories.map(({ category, nominees }) => (
                <AnimatedTabsPanel
                  key={category.id}
                  value={category.id}
                  className="my-auto grid min-w-0 gap-10 py-12 max-md:px-8 sm:grid-cols-2 sm:gap-10 md:grid-cols-3 md:gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {nominees.map((nominee) => (
                    <PersonaCard
                      key={nominee.id}
                      role="button"
                      tabIndex={0}
                      className={cn(
                        "transform-gpu cursor-pointer border-0 border-base-300 transition-all",
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
                </AnimatedTabsPanel>
              ))}

              <div
                className="sticky bottom-16 z-10 flex items-center justify-between px-2 md:bottom-20"
                key="actions"
              >
                <div
                  className={cn(
                    "indicator transition-opacity duration-300 badge-primary",
                    {
                      "opacity-0": votes.length === 0,
                    },
                  )}
                >
                  <span
                    className={cn("indicator-item pointer-events-none badge")}
                  >
                    {votes.length}
                  </span>
                  <div className="dropdown-hover dropdown dropdown-end dropdown-top">
                    <button
                      className="btn btn-square bg-white/50 backdrop-blur-xs btn-lg"
                      disabled={votes.length === 0}
                    >
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

                <button
                  key="submit"
                  className={cn(
                    "btn transform-gpu uppercase transition-all duration-300 ease-in-out btn-lg btn-primary sm:btn-xl",
                    {
                      "pointer-events-auto": votes.length > 0,
                      "translate-y-full opacity-0": votes.length === 0,
                    },
                  )}
                  onClick={() => setIsSubmissionOpen(true)}
                >
                  {t("submit")}
                </button>

                <DialogClose className="btn btn-square border-none bg-white/50 backdrop-blur-xs btn-lg">
                  <IconX stroke={1.5} />
                </DialogClose>
              </div>

              <AnimatedTabsControls
                size="lg"
                className="sticky bottom-0 z-20 min-w-0 flex-1 bg-base-100/30 font-medium tracking-widest shadow-md backdrop-blur-sm max-md:rounded-none md:bottom-4"
                tabs={categories.map(({ category }) => ({
                  label: category.name,
                  value: category.id,
                }))}
                onTabChange={handleTabChange}
              />
            </AnimatedTabs>
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

  return (
    <Dialog modal open={!isAccepted}>
      <DialogContent
        overlayClassName="bg-white/80"
        className="w-[calc(100vw-32px)] max-w-sm rounded-box border border-base-300 bg-base-100/90 p-4 backdrop-blur-sm"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Disclaimer</DialogTitle>
        <h2 className="mb-4 text-center text-2xl leading-tight font-medium text-pretty text-primary select-none">
          {t("intro.title")}
        </h2>
        <HTMLRichText
          className="prose-p:leading-snug"
          content={t.raw("intro.message")}
        />
        <div className="mt-4 flex justify-center">
          <button
            className="btn mx-auto btn-lg btn-primary"
            onClick={() => setIsAccepted(true)}
          >
            {t.raw("intro.CTA")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
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
