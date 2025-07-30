"use client";

import type { Ref } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import type { ContactInfo } from "@/types";

import { cn } from "../utils";

export interface NewsletterSignUpProps {
  ref: Ref<HTMLDialogElement>;
  submitting: boolean;
  onSubmit: (values: ContactInfo) => void;
}

export function NewsletterSignUp({
  ref,
  submitting,
  onSubmit,
}: NewsletterSignUpProps) {
  const t = useTranslations("newsletter");

  const { register, handleSubmit, formState } = useForm<ContactInfo>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
  });

  return (
    <>
      <dialog className="modal" ref={ref}>
        <div className="modal-box max-w-sm p-0 text-base-content">
          <h2 className="flex h-12 items-center justify-center border-b border-base-300 bg-base-200 px-6 text-xl font-medium text-pretty shadow-sm">
            {t("title")}
          </h2>
          <form className="p-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    className={cn("input text-center", {
                      "input-error": formState.errors.firstName !== undefined,
                    })}
                    placeholder={t("placeholders.firstName")}
                    disabled={submitting}
                    {...register("firstName", { required: true })}
                  />
                  <input
                    className={cn("input text-center", {
                      "input-error": formState.errors.lastName !== undefined,
                    })}
                    placeholder={t("placeholders.lastName")}
                    disabled={submitting}
                    {...register("lastName", { required: true })}
                  />
                </div>
                <input
                  className={cn("input w-full text-center", {
                    "input-error": formState.errors.email !== undefined,
                  })}
                  placeholder={t("placeholders.email")}
                  disabled={submitting}
                  {...register("email", { required: true })}
                />
              </div>
              <button
                className="btn btn-block btn-lg btn-primary"
                type="submit"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="loading loading-md loading-spinner"></span>
                ) : (
                  t("submit")
                )}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          {/* TODO i18n */}
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
