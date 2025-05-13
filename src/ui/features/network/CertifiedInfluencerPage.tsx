import { ActionIcon, Flex, Paper, Stack } from "@mantine/core";
import dayjs from "dayjs";
import { useLocale } from "next-intl";

import { derivative } from "@/ui/utils";
import { cn } from "@/ui/utils";

import { getCantonLabel } from "@/cms/resources/certified-influencer/cantons";
import { PageHero } from "@/ui/components/PageHero";
import { SocialMediaPlatformIcon } from "@/ui/components/SocialMediaPlatformIcon";
import { type SupportedLocale } from "@/i18n/config";

import { type ICertifiedInfluencer } from "./data";

export interface ICertifiedInfluencerPageProps {
  data: ICertifiedInfluencer;
}

export function CertifiedInfluencerPage({
  data: {
    heroImage,
    name,
    socials,
    birthdate,
    residence,
    languages,
    about,
    interests,
    categories,
  },
}: ICertifiedInfluencerPageProps) {
  const locale = useLocale() as SupportedLocale;
  const age = derivative(() => {
    const today = dayjs();
    const birthDate = dayjs(birthdate);
    return today.diff(birthDate, "year");
  });

  return (
    <>
      <PageHero
        image={heroImage}
        title={name}
        className="snap-start"
        CTA={
          <Flex gap="lg" className="my-auto">
            {socials.map((social) => (
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
          </Flex>
        }
      />
      <main className="relative z-20 snap-start snap-always bg-white/80 pt-12 pb-32 backdrop-blur">
        <section className="container">
          <Stack className="mx-auto max-w-xl" gap="lg">
            <Paper
              withBorder
              shadow="xs"
              radius="md"
              p="md"
              className="bg-neutral-200"
            >
              <p className="text-xl">{about[locale]}</p>
            </Paper>
            <Flex gap="lg" className="min-w-0 flex-wrap">
              <Paper
                withBorder
                shadow="xs"
                radius="md"
                className="grid flex-1 border bg-neutral-200 p-3"
              >
                <span className="text-4xl leading-none">{age}</span>
                <span className="text-lg leading-none text-nowrap uppercase">
                  Years old
                </span>
              </Paper>
              <Paper
                withBorder
                shadow="xs"
                radius="md"
                className="grid flex-1 border bg-neutral-200 p-3"
              >
                <span className="text-lg leading-none text-nowrap uppercase">
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
                <span className="text-lg leading-none text-nowrap uppercase">
                  Speaks
                </span>
                <Flex
                  gap="xs"
                  className={cn("text-4xl leading-none uppercase", {
                    "text-3xl": languages.length === 3,
                    "text-2xl": languages.length > 3,
                  })}
                >
                  {languages.map((language) => (
                    <span key={language}>{language}</span>
                  ))}
                </Flex>
              </Paper>
            </Flex>
            <Flex gap="lg">
              <Paper
                withBorder
                shadow="xs"
                radius="md"
                p="md"
                className="flex-1 bg-neutral-200"
              >
                <span className="mb-2 text-lg leading-tight uppercase">
                  Cooperation Interests
                </span>
                <ul>
                  {categories.map((category) => (
                    <li key={category.id} className="text-2xl">
                      {category.name[locale]}
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
                <span className="mb-2 text-lg leading-tight uppercase">
                  Other Interests
                </span>
                <ul>
                  {interests[locale].map((interest) => (
                    <li key={interest} className="text-2xl">
                      {interest}
                    </li>
                  ))}
                </ul>
              </Paper>
            </Flex>
          </Stack>
        </section>
      </main>
    </>
  );
}
