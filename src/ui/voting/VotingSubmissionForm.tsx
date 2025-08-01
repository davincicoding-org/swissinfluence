"use client";

import type { FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm, useWatch } from "react-hook-form";
import z from "zod/v4";

import type { VotingValues } from "@/types";
import { isPotentiallySubAddress } from "@/utils/voting";

import { Tooltip, TooltipContent, TooltipTrigger } from "../components/Tooltip";
import { cn } from "../utils";

type FormValues = Pick<
  VotingValues,
  "firstName" | "lastName" | "email" | "newsletter"
>;

const formSchema = z.object({
  firstName: z.string().min(2).max(30),
  lastName: z.string().min(2).max(30),
  email: z.email(),
  newsletter: z.boolean(),
});

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
  const { register, handleSubmit, reset, control } = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      newsletter: true,
    },
    resolver: zodResolver(formSchema),
  });

  const email = useWatch({ control, name: "email" });
  const shouldShowSubaddressWarning = isPotentiallySubAddress(email);

  const getErrorMessage = (error: FieldError | undefined) => {
    if (!error) return null;
    switch (error.type) {
      case "too_small":
        return t("validation.tooShort", { min: "2" });
      case "too_big":
        return t("validation.tooLong", { max: "30" });
      case "invalid_format":
        return t("validation.emailInvalid");
      default:
        return error.message;
    }
  };

  return (
    <div className={cn(className)}>
      <div className="bg-base-200 p-3 text-center text-xl font-medium shadow-md">
        {t("title")}
      </div>
      <form
        onSubmit={handleSubmit((values) => onSubmit(values, reset))}
        className="p-4 pb-2"
        noValidate
      >
        <p className="mb-5 text-center text-sm leading-snug text-balance text-gray-500">
          {t("disclaimer")}
        </p>
        <div>
          <div className="flex">
            <Controller
              control={control}
              name="firstName"
              render={({ field, fieldState }) => (
                <Tooltip open={fieldState.error !== undefined}>
                  <TooltipTrigger asChild>
                    <input
                      className={cn(
                        "input relative input-lg flex-1 !rounded-tr-none !rounded-b-none text-center focus:z-10",
                        {
                          "input-error": fieldState.error !== undefined,
                        },
                      )}
                      placeholder={t("placeholders.firstName")}
                      disabled={isSubmitting}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    className="bg-error px-1.5 py-1 text-error-content"
                    hideArrow
                    sideOffset={-8}
                    side="top"
                  >
                    {getErrorMessage(fieldState.error)}
                  </TooltipContent>
                </Tooltip>
              )}
            />

            <div className="-mx-0.5" />
            <Controller
              control={control}
              name="lastName"
              render={({ field, fieldState }) => (
                <Tooltip open={fieldState.error !== undefined}>
                  <TooltipTrigger asChild>
                    <input
                      className={cn(
                        "input relative input-lg flex-1 !rounded-tl-none !rounded-b-none text-center focus:z-10",
                        {
                          "input-error": fieldState.error !== undefined,
                        },
                      )}
                      placeholder={t("placeholders.lastName")}
                      disabled={isSubmitting}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    className="bg-error px-1.5 py-1 text-error-content"
                    hideArrow
                    sideOffset={-8}
                    side="top"
                  >
                    {getErrorMessage(fieldState.error)}
                  </TooltipContent>
                </Tooltip>
              )}
            />
          </div>
          <div className="-my-0.5" />
          <div>
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <Tooltip open={fieldState.error !== undefined}>
                  <TooltipTrigger asChild>
                    <input
                      className={cn(
                        "input relative input-lg w-full flex-1 !rounded-t-none text-center focus:z-10",
                        {
                          "input-error": fieldState.error !== undefined,
                        },
                      )}
                      type="email"
                      placeholder={t("placeholders.email")}
                      disabled={isSubmitting}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    className="bg-error px-1.5 py-1 text-error-content"
                    hideArrow
                    sideOffset={-8}
                    side="bottom"
                  >
                    {getErrorMessage(fieldState.error)}
                  </TooltipContent>
                </Tooltip>
              )}
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
