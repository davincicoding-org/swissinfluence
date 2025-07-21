"use client";

import { FocusTrap, Modal } from "@mantine/core";
import { useTranslations } from "next-intl";

export interface VotingConfirmationModalProps {
  opened: boolean;
  onClose: () => void;
}

export function VotingConfirmationModal({
  opened,
  onClose,
}: VotingConfirmationModalProps) {
  const t = useTranslations("voting.confirmation");

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title={t("title")}
      classNames={{
        title: "text-xl font-medium",
        body: "text-pretty",
      }}
      radius="md"
      transitionProps={{
        transition: "pop",
        duration: 200,
      }}
    >
      <FocusTrap.InitialFocus />
      {t("description")}
    </Modal>
  );
}
