"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FocusTrap, Modal } from "@mantine/core";
import { useTranslations } from "next-intl";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface VotingConfirmedModalProps {}

export function VotingConfirmedModal({}: VotingConfirmedModalProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("voting.confirmed");
  const handleClose = () => {
    router.replace(pathname);
  };

  return (
    <Modal
      opened={searchParams.get("voting-confirmed") !== null}
      onClose={handleClose}
      centered
      title={t("title")}
      classNames={{
        title: "text-xl font-medium",
        body: "text-pretty",
      }}
      radius="md"
      transitionProps={{
        transition: "pop",
        duration: 500,
      }}
    >
      <FocusTrap.InitialFocus />
      {t("description")}
    </Modal>
  );
}
