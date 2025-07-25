"use client";

import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Paper,
  TextInput,
} from "@mantine/core";
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
      <Box
        bg="gray.0"
        className="p-3 text-center text-xl font-medium shadow-md"
      >
        {t("title")}
      </Box>
      <form
        onSubmit={handleSubmit((values) => onSubmit(values, reset))}
        className="p-4 pb-1"
      >
        <p className="mb-4 text-balance text-center leading-snug text-gray-500">
          {t("disclaimer")}
        </p>
        <div>
          <div className="flex">
            <TextInput
              flex={1}
              size="md"
              radius="md"
              placeholder={t("placeholders.firstName")}
              classNames={{
                input:
                  "text-center relative focus:z-10 rounded-b-none rounded-tr-none",
              }}
              disabled={isSubmitting}
              {...register("firstName", {
                required: true,
                validate: (value) => value.trim().length >= 2,
              })}
              error={formState.errors.firstName !== undefined}
            />
            <div className="-mx-px" />
            <TextInput
              flex={1}
              size="md"
              radius="md"
              placeholder={t("placeholders.lastName")}
              classNames={{
                input:
                  "text-center relative focus:z-10 rounded-b-none rounded-tl-none",
              }}
              disabled={isSubmitting}
              {...register("lastName", {
                required: true,
                validate: (value) => value.trim().length >= 2,
              })}
              error={formState.errors.lastName !== undefined}
            />
          </div>
          <div className="-my-px" />
          <div>
            <TextInput
              size="md"
              radius="md"
              type="email"
              placeholder={t("placeholders.email")}
              classNames={{
                input: "text-center relative focus:z-10 rounded-t-none",
              }}
              disabled={isSubmitting}
              {...register("email", {
                required: true,
              })}
              error={formState.errors.email !== undefined}
            />

            <Collapse
              in={shouldShowSubaddressWarning && !isSubmitting}
              animateOpacity
            >
              <Paper
                radius="md"
                bg="yellow.0"
                className="-mt-4 border border-yellow-500 p-2 pt-5 text-xs"
              >
                {t("subaddressWarning")}
              </Paper>
            </Collapse>
          </div>
        </div>
        <div className="mb-3 mt-5 flex justify-center">
          <Checkbox
            label={t("newsletter")}
            className="mx-auto"
            size="sm"
            disabled={isSubmitting}
            {...register("newsletter")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            fullWidth
            size="md"
            loading={isSubmitting}
            // disabled={!formState.isValid}
          >
            {t("submit")}
          </Button>
          <Button
            variant="subtle"
            color="gray"
            className="mx-auto"
            size="xs"
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            {t("cancel")}
          </Button>
        </div>
      </form>
    </div>
  );
}
