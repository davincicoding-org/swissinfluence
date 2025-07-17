"use client";

import { Button } from "@payloadcms/ui";
import { toast, Toaster } from "sonner";

import { publishChanges } from "@/cms/publish-changes";

export default function PublishButton() {
  const handlePublish = async () => {
    const toastId = toast.loading("Publishing changes...");
    try {
      await publishChanges();
      toast.success("Changes published successfully!", {
        id: toastId,
      });
    } catch (_error) {
      toast.error("Failed to publish changes. Please try again.", {
        id: toastId,
      });
    }
  };

  return (
    <>
      <Button onClick={handlePublish}>Publish</Button>
      <Toaster position="top-right" />
    </>
  );
}
