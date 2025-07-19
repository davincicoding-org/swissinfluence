"use client";

import type { FormEventHandler } from "react";
import { useState } from "react";
import {
  ActionIcon,
  Center,
  Checkbox,
  Modal,
  Paper,
  TextInput,
} from "@mantine/core";
import { IconSend } from "@tabler/icons-react";

import type { VotingValues } from "@/types";

export interface VotingSubmissionModalProps {
  opened: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: Pick<VotingValues, "email" | "newsletter">) => void;
}

// TODO i18n

export function VotingSubmissionModal({
  opened,
  isSubmitting,
  onClose,
  onSubmit,
}: VotingSubmissionModalProps) {
  const [values, setValues] = useState<
    Pick<VotingValues, "email" | "newsletter">
  >({
    email: "",
    newsletter: true,
  });

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
      <p className="mb-4 text-center text-2xl font-medium">
        Some nice title here
      </p>
      <form onSubmit={handleSubmit}>
        <TextInput
          placeholder="Enter your email"
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

      <Paper
        bg="gray.0"
        withBorder
        radius="md"
        className="mx-auto mt-3 text-pretty p-2 text-sm leading-tight text-gray-500 shadow-sm"
      >
        In order for your votes to be valid, you will need to confirm your
        email.
      </Paper>

      {/* <p className="text-centerd text-balanced mt-3 text-sm leading-tight text-gray-500">
          In order for your votes to be valid, you will need to confirm your
          email.
        </p> */}
      <Center>
        <Checkbox
          label="Stay updated on the latest news and events"
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
