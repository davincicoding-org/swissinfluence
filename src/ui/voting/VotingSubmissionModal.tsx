"use client";

import { Button, FocusTrap, Modal } from "@mantine/core";
import { useTranslations } from "next-intl";

export interface VotingSubmissionModalProps {
  opened: boolean;
  onClose: () => void;
}

export function VotingSubmissionModal({
  opened,
  onClose,
}: VotingSubmissionModalProps) {
  const t = useTranslations("voting.submission");

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="sm"
      withCloseButton={false}
      title={t("title")}
      classNames={{
        title: "text-xl font-medium mx-auto text-pretty",
        body: "text-pretty",
      }}
      radius="md"
      transitionProps={{
        transition: "pop",
      }}
    >
      <FocusTrap.InitialFocus />
      {t("message")}

      <Button
        fullWidth
        radius="md"
        size="md"
        className="mt-5"
        onClick={onClose}
      >
        {t("close")}
      </Button>
    </Modal>
  );
}
