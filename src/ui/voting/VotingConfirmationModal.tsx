"use client";

import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "../components/Dialog";

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
    <Dialog open={opened} onOpenChange={onClose}>
      <form>
        <DialogContent className="max-w-sm p-0" showCloseButton={false}>
          <DialogTitle className="flex h-12 items-center justify-center border-b border-base-300 bg-base-200 px-6 text-xl font-medium text-pretty shadow-md">
            {t("title")}
          </DialogTitle>
          <div className="p-4">
            <p className="text-pretty"> {t("message")} </p>
            <DialogClose
              className="btn mt-5 btn-block btn-lg btn-primary"
              onClick={onClose}
            >
              {t("close")}
            </DialogClose>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
