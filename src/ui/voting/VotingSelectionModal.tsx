"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
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

// TODO Merge mobile and desktop views to reduce HTML size

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
      <dialog open={opened} onClose={onClose} className="modal">
        <div
          className={cn(
            "modal-box w-screen max-w-none rounded-none bg-base-100/20 p-0 backdrop-blur-sm",
          )}
        >
          <div className="sticky top-0 z-20 -mb-12 flex h-12 items-center justify-end pr-3 sm:-mb-16 sm:h-16">
            <button
              className="btn !btn-circle size-10 bg-transparent backdrop-blur-xs btn-xl max-sm:border-none sm:bg-white/50"
              onClick={onClose}
            >
              <IconX stroke={1.5} />
            </button>
          </div>

          {categories.map(({ category, nominees }) => {
            const isSelected = (influencerId: Influencer["id"]) =>
              votes.some((vote) =>
                isEqual(vote, {
                  influencer: influencerId,
                  category: category.id,
                }),
              );
            const handleToggle = (influencerId: Influencer["id"]) =>
              onToggleVote({
                influencer: influencerId,
                category: category.id,
              });

            return (
              <Fragment key={category.id}>
                <ListView
                  category={category.name}
                  focused={category.id === focusCategory}
                  className="sm:hidden"
                  nominees={nominees}
                  isSelected={isSelected}
                  onToggle={handleToggle}
                />
                <GridView
                  category={category.name}
                  focused={category.id === focusCategory}
                  className="max-sm:hidden"
                  nominees={nominees}
                  isSelected={isSelected}
                  onToggle={handleToggle}
                />
              </Fragment>
            );
          })}

          <div className="pointer-events-none sticky bottom-0 z-10 flex justify-center p-3 *:pointer-events-auto">
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
                    className="btn uppercase btn-lg btn-primary"
                    onClick={() => setIsSubmissionOpen(true)}
                  >
                    {t("submit")}
                  </button>

                  <div className="indicator">
                    <span className="indicator-item badge badge-primary">
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
                  className="border-base rounded-box border bg-base-200 p-3"
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
        </div>
        <form method="dialog" className="modal-backdrop backdrop-blur-md">
          <button>Close</button>
        </form>
      </dialog>

      <dialog
        className="modal"
        open={isSubmissionOpen}
        onClose={() => setIsSubmissionOpen(false)}
      >
        <div className="border-base modal-box max-w-sm overflow-clip border p-0 backdrop-blur-xs">
          <VotingSubmissionForm
            isSubmitting={submitting}
            onSubmit={handleSubmit}
            onCancel={() => setIsSubmissionOpen(false)}
          />
        </div>
        <div className="modal-backdrop backdrop-blur-md" />
      </dialog>
    </>
  );
}

interface ViewProps {
  category: string;
  focused: boolean;
  nominees: Influencer[];
  isSelected: (influencerId: Influencer["id"]) => boolean;
  onToggle: (influencerId: Influencer["id"]) => void;
  className?: string;
}

// MARK: Grid View

function GridView({
  category,
  focused,
  nominees,
  onToggle,
  isSelected,
  className,
}: ViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!focused) return;
    ref.current?.scrollIntoView({ behavior: "instant", block: "start" });
  }, [focused]);
  return (
    <div className={cn(className)} ref={ref}>
      <div className="sticky top-0 z-10 flex h-16 items-center px-6 md:py-4">
        <div className="badge h-auto bg-white/50 badge-xl py-1 text-xl font-medium backdrop-blur-xs">
          {category}
        </div>
      </div>
      <div className={cn("grid cols-autofill-250 gap-5 px-6 pb-6")}>
        {nominees.map((nominee) => (
          <PersonaCard
            key={nominee.id}
            role="button"
            tabIndex={0}
            className={cn(
              "cursor-pointer opacity-70 transition-all hover:opacity-100",
              {
                "border-8 border-primary opacity-100": isSelected(nominee.id),
              },
            )}
            socials={nominee.socials ?? []}
            name={nominee.name}
            image={nominee.image}
            imageSizes="500px"
            revealed
            onClick={() => onToggle(nominee.id)}
            onSocialClick={(e) => e.stopPropagation()}
          />
        ))}
      </div>
    </div>
  );
}

// MARK: List View

function ListView({
  category,
  focused,
  nominees,
  onToggle,
  isSelected,
  className,
}: ViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!focused) return;
    ref.current?.scrollIntoView({ behavior: "instant", block: "start" });
  }, [focused]);

  return (
    <div ref={ref} className={cn(className)}>
      <div className="sticky top-0 z-10 flex h-12 items-center bg-white/50 pr-12 pl-4 backdrop-blur-xs">
        <span className="min-w-0 truncate text-2xl leading-none font-medium select-none">
          {category}
        </span>
      </div>
      <div className={cn("flex flex-col gap-3 px-4 pb-3")}>
        {nominees.map((nominee) => (
          <PersonaCard
            key={nominee.id}
            name={nominee.name}
            image={nominee.image}
            socials={nominee.socials ?? []}
            maxSocials={5}
            className={cn({
              "border-primar": isSelected(nominee.id),
            })}
            revealed
            onClick={() => onToggle(nominee.id)}
          />
        ))}
      </div>
    </div>
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
    <div className="max-h-96 overflow-y-auto rounded-box bg-base-100 px-1">
      <AnimatePresence>
        {selection.map(({ category, influencers }) => (
          <m.ul
            key={`category-${category.id}`}
            className="list"
            exit={{ opacity: 0, x: 10 }}
          >
            <m.li
              key={category.id}
              className="sticky top-0 z-10 bg-base-300/30 p-4 pt-2 pb-2 text-xl font-medium tracking-wide backdrop-blur-xs"
            >
              {category.name}
            </m.li>
            <AnimatePresence>
              {influencers.map((influencer) => (
                <m.li
                  key={influencer.id}
                  className="list-row"
                  exit={{ opacity: 0, x: 10 }}
                >
                  <Image
                    resource={influencer.image}
                    alt={influencer.name}
                    className="size-10 shrink-0 rounded-md"
                    sizes="80px"
                  />
                  <p className="my-auto text-lg leading-tight text-pretty">
                    {influencer.name}
                  </p>
                  <button
                    className="btn my-auto btn-square btn-ghost"
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
