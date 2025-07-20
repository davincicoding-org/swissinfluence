"use client";

import type { FormEventHandler } from "react";
import { useState } from "react";
import {
  ActionIcon,
  Center,
  Checkbox,
  Collapse,
  Modal,
  Paper,
  TextInput,
} from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

import type { VotingValues } from "@/types";
import { isPotentiallySubAddress } from "@/utils/voting";

export interface VotingSubmissionModalProps {
  opened: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: Pick<VotingValues, "email" | "newsletter">) => void;
}

export function VotingSubmissionModal({
  opened,
  isSubmitting,
  onClose,
  onSubmit,
}: VotingSubmissionModalProps) {
  const t = useTranslations("award.voting.submission");
  const [values, setValues] = useState<
    Pick<VotingValues, "email" | "newsletter">
  >({
    email: "",
    newsletter: true,
  });

  const shouldShowSubaddressWarning = isPotentiallySubAddress(values.email);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (values.email.trim() === "") return;
    onSubmit(values);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton={false}
      radius="md"
      transitionProps={{
        transition: "pop",
        duration: 200,
      }}
    >
      <p className="mb-4 text-center text-2xl font-medium">{t("title")}</p>
      <form onSubmit={handleSubmit}>
        <TextInput
          placeholder={t("emailPlaceholder")}
          type="email"
          required
          size="lg"
          radius="md"
          disabled={isSubmitting}
          value={values.email}
          onChange={({ currentTarget: { value } }) =>
            setValues((prev) => ({ ...prev, email: value }))
          }
          rightSection={
            <ActionIcon size="lg" type="submit" loading={isSubmitting}>
              <IconSend />
            </ActionIcon>
          }
        />
      </form>

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

      <Paper
        bg="gray.0"
        withBorder
        radius="md"
        className="mx-auto mt-3 text-pretty p-2 text-sm leading-tight text-gray-500 shadow-sm"
      >
        {t("disclaimer")}
      </Paper>

      <Center>
        <Checkbox
          label={t("newsletter")}
          checked={values.newsletter}
          className="mt-4"
          disabled={isSubmitting}
          onChange={({ currentTarget: { checked } }) =>
            setValues((prev) => ({ ...prev, newsletter: checked }))
          }
        />
      </Center>
    </Modal>
  );
}
