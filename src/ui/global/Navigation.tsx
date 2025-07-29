"use client";

import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import { IconMenu, IconWorld } from "@tabler/icons-react";
import { AnimatePresence, useMotionValueEvent, useScroll } from "motion/react";
import { useTranslations } from "next-intl";
import { Slot } from "radix-ui";
import { Events } from "react-scroll";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/ui/utils";

export interface NavigationProps {
  homeLink: string;
  locale: string;
  mainLogo: ReactElement<{ className?: string; onClick?: () => void }>;
  locales: ReadonlyArray<string>;
  mainLinks: Array<{
    label: string;
    href: string;
    logo?: ReactElement<{ className?: string; onClick?: () => void }>;
    children?: Array<{
      label: string;
      href: string;
    }>;
  }>;
  subLinks: Array<{
    label: string;
    href: string;
  }>;
}
export function Navigation({
  homeLink,
  locale,
  locales,
  mainLogo,
  mainLinks,
  subLinks,
}: NavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { scrollY } = useScroll();
  const t = useTranslations("navigation");

  const [visible, setVisible] = useState(true);

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

  const activeLink = mainLinks
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

  const logo = activeLink?.logo ?? mainLogo;

  // Using Link causes "Page prevented back/forward cache restoration" in Lighthouse audit
  const handleLogoClick = () => {
    if (activeLink?.href === homeLink) return;
    router.push(homeLink);
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
            <div className="animate-header-entrance flex h-16 items-center justify-between gap-4 rounded-box bg-neutral/90 px-4 py-6 shadow-sm">
              <Slot.Root
                onClick={handleLogoClick}
                className={cn(logo.props.className, {
                  "cursor-pointer": pathname !== homeLink,
                })}
              >
                {logo}
              </Slot.Root>

              <MobileNavigation
                locale={locale}
                locales={locales}
                homeLink={homeLink}
                mainLinks={mainLinks}
                subLinks={subLinks}
                triggerClassName="md:hidden"
                pathname={pathname}
                onLocaleChange={handleLocaleChange}
              />

              <div className="flex max-md:hidden">
                {mainLinks.map(({ label, href, children }) => (
                  <div key={label} className="dropdown-hover group dropdown">
                    <Link
                      href={href}
                      scroll
                      className={cn(
                        "relative flex items-center border-b-2 border-transparent px-2 py-1 text-base font-medium tracking-wider text-neutral-content/70 uppercase transition-all group-hover:text-neutral-content",
                        {
                          "group-hover:border-transparent": children,
                          "border-neutral-content text-neutral-content":
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
                          <li key={childLink.label}>
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
                    className="btn !btn-circle !border-transparent bg-transparent text-neutral-content/70 btn-ghost btn-sm"
                    aria-label={t("aria.langSwitch")}
                  >
                    <IconWorld stroke={1.5} />
                  </button>
                  <div className="dropdown-content menu z-1 rounded-box bg-neutral/90">
                    {locales.map((option) => (
                      <li
                        key={option}
                        // color={locale === option ? "mocha" : "gray"}
                        // fw={locale === option ? 600 : 500}
                      >
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
    </>
  );
}

// MARK: Mobile Navigation

interface MobileNavigationProps extends Omit<NavigationProps, "mainLogo"> {
  pathname: string;
  triggerClassName: string;
  onLocaleChange: (nextLocale: string | null) => void;
}

function MobileNavigation({
  mainLinks,
  homeLink,
  subLinks,
  locale,
  locales,
  triggerClassName,
  pathname,
  onLocaleChange,
}: MobileNavigationProps) {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <button
        className={cn(
          "btn btn-circle text-primary-content btn-ghost btn-sm",
          triggerClassName,
        )}
        onClick={open}
        aria-label="Open navigation"
      >
        <IconMenu />
      </button>
      <dialog open={opened} onClose={close} className="modal modal-bottom">
        <div className="modal-box bg-neutral/70 p-0 backdrop-blur-sm">
          <div className="mb-6 flex items-center justify-between p-4">
            <Link href={homeLink} onClick={close}>
              <Image
                priority
                className="h-12 translate-y-1"
                alt="SIA Logo"
                src="/logos/main.svg"
                width={89}
                height={44}
              />
            </Link>

            <div className="join">
              {locales.map((option) => (
                <button
                  key={option}
                  className={cn("bg-ghost btn join-item btn-sm", {
                    "btn-primary": option === locale,
                  })}
                  onClick={() => onLocaleChange(option)}
                >
                  {option.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-2 grid grid-cols-2 gap-4 px-4">
            {mainLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={close}
                className={cn(
                  "block rounded-box border border-current py-3 text-center text-xl font-light tracking-wider text-neutral-content transition-transform active:scale-95",
                  { "text-primary": pathname.startsWith(href) },
                )}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex w-full flex-nowrap justify-between gap-4 overflow-x-auto overscroll-x-contain p-4">
            {subLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={close}
                className={cn(
                  "text-nowrap text-neutral-content/70 underline-offset-4 hover:underline",
                  { "text-primary": pathname.startsWith(href) },
                )}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop backdrop-blur-sm">
          {/* TODO I18N */}
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
