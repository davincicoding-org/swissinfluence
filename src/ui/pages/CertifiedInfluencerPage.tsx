import { ActionIcon, Paper } from "@mantine/core";
import dayjs from "dayjs";
import { useLocale } from "next-intl";

import type { CertifiedInfluencer } from "@/types";
import { PageHero } from "@/ui/components/PageHero";
import { SocialMediaPlatformIcon } from "@/ui/components/SocialMediaPlatformIcon";
import { cn, derivative } from "@/ui/utils";
import { getCantonLabel } from "@/utils/cantons";
import { ensureResolved } from "@/utils/payload";

export interface CertifiedInfluencerPageProps {
  influencer: CertifiedInfluencer;
}

export function CertifiedInfluencerPage({
  influencer: {
    image,
    name,
    socials,
    birthdate,
    residence,
    languages,
    bio,
    categories,
    interests,
  },
}: CertifiedInfluencerPageProps) {
  const locale = useLocale();
  const age = derivative(() => {
    const today = dayjs();
    const birthDate = dayjs(birthdate);
    return today.diff(birthDate, "year");
  });

  return (
    <>
      <PageHero
        image={ensureResolved(image)!}
        title={name}
        CTA={
          <div className="my-auto flex gap-6">
            {(socials ?? []).map((social) => (
              <ActionIcon
                key={social.platform}
                component="a"
                variant="subtle"
                size="xl"
                color="white"
                radius="md"
                href={social.url}
                target="_blank"
              >
                <SocialMediaPlatformIcon platform={social.platform} size={48} />
              </ActionIcon>
            ))}
          </div>
        }
      />
      <main className="relative z-20 bg-white/80 pb-32 pt-12 backdrop-blur">
        <section className="container">
          <div className="mx-auto flex max-w-xl flex-col gap-6">
            <Paper
              withBorder
              shadow="xs"
              radius="md"
              p="md"
              className="bg-neutral-200"
            >
              <p className="text-xl">{bio}</p>
            </Paper>
            <div className="flex min-w-0 flex-wrap gap-6">
              <Paper
                withBorder
                shadow="xs"
                radius="md"
                className="grid flex-1 border bg-neutral-200 p-3"
              >
                <span className="text-4xl leading-none">{age}</span>
                <span className="text-nowrap text-lg uppercase leading-none">
                  Years old
                </span>
              </Paper>
              <Paper
                withBorder
                shadow="xs"
                radius="md"
                className="grid flex-1 border bg-neutral-200 p-3"
              >
                <span className="text-nowrap text-lg uppercase leading-none">
                  Based in
                </span>
                <span className="text-4xl leading-none">
                  {getCantonLabel(residence, locale)}
                </span>
              </Paper>
              <Paper
                withBorder
                shadow="xs"
                radius="md"
                className="flex-1 border bg-neutral-200 p-3"
              >
                <span className="text-nowrap text-lg uppercase leading-none">
                  Speaks
                </span>
                <div
                  className={cn("flex gap-3 text-4xl uppercase leading-none", {
                    "text-3xl": languages.length === 3,
                    "text-2xl": languages.length > 3,
                  })}
                >
                  {languages.map((language) => (
                    <span key={language}>{language}</span>
                  ))}
                </div>
              </Paper>
            </div>
            <div className="flex gap-6">
              <Paper
                withBorder
                shadow="xs"
                radius="md"
                p="md"
                className="flex-1 bg-neutral-200"
              >
                <span className="mb-2 text-lg uppercase leading-tight">
                  Cooperation Interests
                </span>
                <ul>
                  {categories.map((category) => (
                    <li key={category.id} className="text-2xl">
                      {category.name}
                    </li>
                  ))}
                </ul>
              </Paper>

              <Paper
                withBorder
                shadow="xs"
                radius="md"
                p="md"
                className="flex-1 bg-neutral-200"
              >
                <span className="mb-2 text-lg uppercase leading-tight">
                  Other Interests
                </span>
                <ul>
                  {interests?.split(/[\n,]+/).map((interest) => (
                    <li key={interest} className="text-2xl">
                      {interest.trim()}
                    </li>
                  ))}
                </ul>
              </Paper>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
