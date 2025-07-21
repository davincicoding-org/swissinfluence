"use client";

import type { Ref } from "react";
import { useImperativeHandle } from "react";
import {
  Button,
  Checkbox,
  Collapse,
  Divider,
  Modal,
  Paper,
  Stack,
  TextInput,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import type { VotingValues } from "@/types";
import { isPotentiallySubAddress } from "@/utils/voting";

type FormValues = Pick<
  VotingValues,
  "firstName" | "lastName" | "email" | "newsletter"
>;

export interface VotingSubmissionModalProps {
  opened: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => void;
  resetRef: Ref<() => void>;
}

export function VotingSubmissionModal({
  opened,
  isSubmitting,
  resetRef,
  onClose,
  onSubmit,
}: VotingSubmissionModalProps) {
  const t = useTranslations("voting.submission");
  const { register, watch, handleSubmit, formState, reset } =
    useForm<FormValues>({
      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        newsletter: true,
      },
    });
  useImperativeHandle(resetRef, () => reset);

  const email = watch("email");
  const shouldShowSubaddressWarning = isPotentiallySubAddress(email);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton={false}
      radius="md"
      size="sm"
      transitionProps={{
        transition: "pop",
        duration: 200,
      }}
    >
      <p className="text-center text-xl font-medium">{t("title")}</p>
      <Divider mb="md" mt={8} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Stack gap="xs">
            <div className="flex gap-2">
              <TextInput
                flex={1}
                placeholder={t("placeholders.firstName")}
                disabled={isSubmitting}
                {...register("firstName", {
                  required: true,
                  validate: (value) => value.trim().length >= 2,
                })}
                error={formState.errors.firstName !== undefined}
              />
              <TextInput
                flex={1}
                placeholder={t("placeholders.lastName")}
                disabled={isSubmitting}
                {...register("lastName", {
                  required: true,
                  validate: (value) => value.trim().length >= 2,
                })}
                error={formState.errors.lastName !== undefined}
              />
            </div>
            <div>
              <TextInput
                placeholder={t("placeholders.email")}
                type="email"
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

            <p className="-mt-1 text-pretty text-xs leading-snug text-gray-500">
              {t("disclaimer")}
            </p>
          </Stack>

          <Button
            type="submit"
            fullWidth
            size="md"
            loading={isSubmitting}
            // disabled={!formState.isValid}
          >
            {t("submit")}
          </Button>

          <Checkbox
            label={t("newsletter")}
            className="mx-auto"
            disabled={isSubmitting}
            {...register("newsletter", { required: true })}
          />
        </Stack>
      </form>
    </Modal>
  );
}
