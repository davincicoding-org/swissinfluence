"use client";

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
    <dialog className="modal" open={opened} onClose={onClose}>
      <div className="modal-box p-0">
        <h2 className="flex h-12 items-center justify-center border-b border-base-300 bg-base-200 px-6 text-xl font-medium text-pretty shadow-md">
          {t("title")}
        </h2>
        <div className="p-6">
          <p className="text-pretty"> {t("message")} </p>
          <button
            className="btn mt-5 btn-block btn-lg btn-primary"
            onClick={onClose}
          >
            {t("close")}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop backdrop-blur-md">
        {/* TODO: i18n */}
        <button>Close</button>
      </form>
    </dialog>
  );
}
