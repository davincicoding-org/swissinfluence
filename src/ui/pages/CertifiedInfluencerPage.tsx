import dayjs from "dayjs";
import { useLocale, useTranslations } from "next-intl";

import type { CertifiedInfluencer } from "@/types";
import { PageHero } from "@/ui/components/PageHero";
import { SocialsLinks } from "@/ui/components/SocialLinks";
import { cn, derivative } from "@/ui/utils";
import { getCantonLabel } from "@/utils/cantons";

export interface CertifiedInfluencerPageProps {
  influencer: CertifiedInfluencer;
}

export function CertifiedInfluencerPage({
  influencer: {
    heroImage,
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
  const t = useTranslations("influencers.profile");
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
        CTA={
          <SocialsLinks
            classNames={{
              root: "m-auto",
              item: "!size-16 !btn-circle text-white",
              icon: "size-12",
            }}
            items={socials ?? []}
          />
        }
      />
      <main className="relative z-20 bg-white/80 pt-12 pb-32 backdrop-blur-sm">
        <section className="container">
          <div className="mx-auto flex max-w-xl flex-col gap-6">
            <div className="rounded-box border border-base-300 bg-base-200 p-5 shadow-sm">
              <p className="prose-lg">{bio}</p>
            </div>
            <div className="grid min-w-0 grid-cols-2 flex-wrap gap-3 sm:gap-6">
              <div className="grid rounded-box border border-base-300 bg-base-200 p-3 shadow-sm sm:justify-center">
                <div className="my-auto flex items-baseline gap-x-2 gap-y-1 max-sm:flex-col">
                  <span className="text-4xl leading-none text-primary">
                    {age}
                  </span>
                  <span className="text-xl leading-none text-nowrap uppercase opacity-60">
                    {t("age")}
                  </span>
                </div>
              </div>

              <div className="grid rounded-box border border-base-300 bg-base-200 p-3 shadow-sm sm:justify-center">
                <div
                  className={cn(
                    "my-auto flex items-baseline gap-3 gap-y-1 max-sm:flex-col",
                    {
                      "flex-col": languages.length > 3,
                    },
                  )}
                >
                  <span className="text-xl leading-none text-nowrap uppercase opacity-60">
                    {t("speaks")}
                  </span>
                  <p
                    className={cn(
                      "flex flex-wrap gap-1 text-4xl leading-none text-primary uppercase",
                      {
                        "text-3xl": languages.length === 3,
                        "text-2xl": languages.length > 3,
                      },
                    )}
                  >
                    {languages.map((language) => (
                      <span key={language}>{language}</span>
                    ))}
                  </p>
                </div>
              </div>

              <div className="col-span-2 flex flex-wrap items-baseline justify-center gap-x-2 rounded-box border border-base-300 bg-base-200 p-3 shadow-sm">
                <span className="text-lg leading-none text-nowrap uppercase opacity-60">
                  {t("based-in")}
                </span>
                <span className="text-4xl leading-none text-primary">
                  {getCantonLabel(residence, locale)}
                </span>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-1 rounded-box border border-base-300 bg-base-200 p-3 shadow-sm">
                <span className="mb-2 text-lg leading-tight uppercase">
                  {t("cooperation-interests")}
                </span>
                <ul>
                  {categories.map((category) => (
                    <li key={category.id} className="text-2xl">
                      {category.name}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex-1 rounded-box border border-base-300 bg-base-200 p-3 shadow-sm">
                <span className="mb-2 text-lg leading-tight uppercase">
                  {t("other-interests")}
                </span>
                <ul>
                  {interests?.split(/[\n,]+/).map((interest) => (
                    <li key={interest} className="text-2xl">
                      {interest.trim()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
