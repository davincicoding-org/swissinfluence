"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import { IconMenu, IconWorld } from "@tabler/icons-react";
import { AnimatePresence, useMotionValueEvent, useScroll } from "motion/react";
import { useTranslations } from "next-intl";
import { Events } from "react-scroll";

import type { SupportedLocale } from "@/i18n/config";
import type { NavigationConfig } from "@/types";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/ui/utils";

import { MobileNavigation } from "./MobileDrawer";

export interface FloatingHeaderProps {
  config: NavigationConfig;
  locale: SupportedLocale;
  locales: SupportedLocale[];
}
export function FloatingHeader({
  config,
  locale,
  locales,
}: FloatingHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { scrollY } = useScroll();
  const t = useTranslations("navigation");

  const [visible, setVisible] = useState(true);
  const [isMobileDrawerOpen, mobileDrawer] = useDisclosure(false);

  const isNavigating = useRef(false);

  useEffect(() => {
    Events.scrollEvent.register("begin", () => {
      isNavigating.current = true;
    });
    Events.scrollEvent.register("end", () => {
      setTimeout(() => {
        isNavigating.current = false;
      }, 0);
    });
    return () => {
      Events.scrollEvent.remove("begin");
      Events.scrollEvent.remove("end");
    };
  }, []);

  const activeLink = config.mainLinks
    .flatMap(({ href, logo, children }) =>
      children?.length
        ? [
            { href, logo },
            ...children.map((child) => ({
              href: child.href,
              logo,
            })),
          ]
        : [{ href, logo }],
    )
    .find(({ href }) => pathname.startsWith(href));

  useMotionValueEvent(scrollY, "change", (current) => {
    if (isNavigating.current) return setVisible(false);

    if (typeof current === "number") {
      const direction = current - (scrollY.getPrevious() ?? 0);

      if (scrollY.get() === 0 || direction < 0) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }
  });

  // Using Link causes "Page prevented back/forward cache restoration" in Lighthouse audit
  const handleLogoClick = () => {
    if (activeLink?.href === config.homeLink) return;
    router.push(config.homeLink);
  };

  const handleLocaleChange = (nextLocale: string | null) => {
    if (!nextLocale) return;
    router.replace(
      // @ts-expect-error -- TypeScript will validate that only known `params` are used in combination with a given `pathname`. Since the two will always match for the current route, we can skip runtime checks.
      { pathname, params },
      { locale: nextLocale },
    );
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <div
          className={cn(
            "fixed inset-x-0 top-0 z-10 transition-transform duration-500",
            {
              "-translate-y-full": !visible,
            },
          )}
        >
          <div className="h-16 bg-(--mantine-color-body)" />
        </div>
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <div
          className={cn(
            "fixed inset-x-0 top-4 z-30 transition-all duration-500 sm:top-6 md:top-8",
            {
              "-translate-y-full opacity-0": !visible,
            },
          )}
        >
          <div className="container">
            <div className="flex h-16 animate-header-entrance items-center justify-between gap-4 rounded-box bg-neutral/90 px-4 py-6 shadow-sm">
              <Image
                priority
                unoptimized
                alt="Logo"
                src={activeLink?.logo ?? config.mainLogo}
                className={cn("h-9 w-auto shrink-0", {
                  "cursor-pointer": pathname !== config.homeLink,
                  "translate-y-0.5": !activeLink?.logo,
                })}
                onClick={handleLogoClick}
              />

              <button
                className="btn btn-circle text-primary-content btn-ghost btn-sm md:hidden"
                onClick={mobileDrawer.open}
                aria-label="Open navigation"
              >
                <IconMenu />
              </button>

              <div className="flex max-md:hidden">
                {config.mainLinks.map(({ label, href, children }) => (
                  <div key={label} className="dropdown-hover group dropdown">
                    <Link
                      href={href}
                      scroll
                      className={cn(
                        "relative flex items-center border-y-2 border-transparent px-2 py-1 text-base font-medium tracking-wider text-neutral-content/70 uppercase transition-all group-hover:text-neutral-content",
                        {
                          "group-hover:border-transparent": children,
                          "border-b-neutral-content text-neutral-content":
                            href === pathname,
                          "text-neutral-content": pathname.startsWith(href),
                        },
                      )}
                    >
                      {label}
                    </Link>
                    {children && (
                      <ul className="dropdown-content menu z-1 rounded-box bg-neutral/90">
                        {children.map((childLink) => (
                          <li key={childLink.href}>
                            <Link
                              key={childLink.label}
                              href={childLink.href}
                              scroll
                              onClick={(e) => {
                                e.currentTarget.blur();
                              }}
                              className={cn(
                                "relative flex items-center px-2 text-base font-medium tracking-wider text-neutral-content uppercase transition-all hover:text-primary",
                                {
                                  "text-primary": pathname === childLink.href,
                                },
                              )}
                            >
                              {childLink.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
                <div className="dropdown-hover dropdown dropdown-center ml-2">
                  <button
                    className="btn !btn-circle !border-transparent bg-transparent text-neutral-content/70 btn-ghost"
                    aria-label={t("aria.langSwitch")}
                  >
                    <IconWorld stroke={1.5} />
                  </button>
                  <div className="dropdown-content menu z-1 rounded-box bg-neutral/90">
                    {locales.map((option) => (
                      <li key={option}>
                        <button
                          className={cn(
                            "justify-center",
                            locale === option
                              ? "text-primary"
                              : "text-neutral-content/70 hover:text-neutral-content",
                          )}
                          onClick={() => handleLocaleChange(option)}
                        >
                          {option.toUpperCase()}
                        </button>
                      </li>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatePresence>

      <MobileNavigation
        opened={isMobileDrawerOpen}
        onClose={mobileDrawer.close}
        config={config}
        locale={locale}
        locales={locales}
        pathname={pathname}
        onLocaleChange={handleLocaleChange}
      />
    </>
  );
}
