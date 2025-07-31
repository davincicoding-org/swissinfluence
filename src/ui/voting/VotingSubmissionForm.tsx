"use client";

import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";

import type { VotingValues } from "@/types";
import { isPotentiallySubAddress } from "@/utils/voting";

import { cn } from "../utils";

type FormValues = Pick<
  VotingValues,
  "firstName" | "lastName" | "email" | "newsletter"
>;

export interface VotingSubmissionFormProps {
  isSubmitting: boolean;
  className?: string;
  onSubmit: (values: FormValues, callback: () => void) => void;
  onCancel: () => void;
}

export function VotingSubmissionForm({
  isSubmitting,
  className,
  onSubmit,
  onCancel,
}: VotingSubmissionFormProps) {
  const t = useTranslations("voting.form");
  const { register, handleSubmit, formState, reset, control } =
    useForm<FormValues>({
      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        newsletter: true,
      },
    });

  const email = useWatch({ control, name: "email" });
  const shouldShowSubaddressWarning = isPotentiallySubAddress(email);

  return (
    <div className={cn(className)}>
      <div className="bg-base-200 p-3 text-center text-xl font-medium shadow-md">
        {t("title")}
      </div>
      <form
        onSubmit={handleSubmit((values) => onSubmit(values, reset))}
        className="p-4 pb-2"
      >
        <p className="mb-5 text-center text-sm leading-snug text-balance text-gray-500">
          {t("disclaimer")}
        </p>
        <div>
          <div className="flex">
            <input
              className={cn(
                "input relative input-lg flex-1 !rounded-tr-none !rounded-b-none text-center focus:z-10",
                {
                  "input-error": formState.errors.firstName !== undefined,
                },
              )}
              placeholder={t("placeholders.firstName")}
              disabled={isSubmitting}
              {...register("firstName", {
                required: true,
                validate: (value) => value.trim().length >= 2,
              })}
            />
            <div className="-mx-0.5" />
            <input
              className={cn(
                "input relative input-lg flex-1 !rounded-tl-none !rounded-b-none text-center focus:z-10",
                {
                  "input-error": formState.errors.lastName !== undefined,
                },
              )}
              placeholder={t("placeholders.lastName")}
              disabled={isSubmitting}
              {...register("lastName", {
                required: true,
                validate: (value) => value.trim().length >= 2,
              })}
            />
          </div>
          <div className="-my-0.5" />
          <div>
            <input
              className={cn(
                "input relative input-lg w-full flex-1 !rounded-t-none text-center focus:z-10",
                {
                  "input-error": formState.errors.email !== undefined,
                },
              )}
              type="email"
              placeholder={t("placeholders.email")}
              disabled={isSubmitting}
              {...register("email", {
                required: true,
              })}
            />

            <div
              className={cn("collapse -mt-4", {
                "collapse-open": shouldShowSubaddressWarning && !isSubmitting,
              })}
            >
              <div className="collapse-content rounded-box border border-warning bg-warning/30 !p-2 !pt-5 text-xs">
                {t("subaddressWarning")}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 mb-3 flex">
          <label className="mx-auto label text-sm text-pretty">
            <input
              type="checkbox"
              defaultChecked
              className="checkbox"
              disabled={isSubmitting}
              {...register("newsletter")}
            />
            {t("newsletter")}
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="submit"
            className="btn btn-block btn-lg btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-md loading-spinner"></span>
            ) : (
              t("submit")
            )}
          </button>
          <button
            className="btn mx-auto btn-ghost btn-sm"
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            {t("cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}
