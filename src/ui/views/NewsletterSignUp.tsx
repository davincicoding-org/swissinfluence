import { Button, Modal, Stack, TextInput } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import type { NewsletterValues } from "@/types";

export interface NewsletterSignUpProps {
  opened: boolean;
  onClose: () => void;
  submitting: boolean;
  onSubmit: (values: NewsletterValues) => void;
}

export function NewsletterSignUp({
  opened,
  onClose,
  submitting,
  onSubmit,
}: NewsletterSignUpProps) {
  const t = useTranslations("newsletter");
  const { register, handleSubmit, formState } = useForm<NewsletterValues>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
  });

  return (
    <Modal
      opened={opened}
      title={t("title")}
      size="sm"
      radius="md"
      classNames={{
        title: "text-xl font-medium",
      }}
      centered
      onClose={onClose}
      transitionProps={{
        transition: "pop",
        duration: 200,
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Stack gap={8}>
            <div className="flex gap-2">
              <TextInput
                placeholder={t("placeholders.firstName")}
                disabled={submitting}
                {...register("firstName", { required: true })}
                error={formState.errors.firstName !== undefined}
              />
              <TextInput
                placeholder={t("placeholders.lastName")}
                disabled={submitting}
                {...register("lastName", { required: true })}
                error={formState.errors.lastName !== undefined}
              />
            </div>
            <TextInput
              placeholder={t("placeholders.email")}
              disabled={submitting}
              {...register("email", { required: true })}
              error={formState.errors.email !== undefined}
            />
          </Stack>
          <Button type="submit" fullWidth loading={submitting}>
            {t("submit")}
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
