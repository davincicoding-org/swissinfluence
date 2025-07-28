"use client";

import type { ReactElement } from "react";
import { cloneElement, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ActionIcon,
  Drawer,
  FocusTrap,
  Menu,
  SegmentedControl,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMenu, IconWorld } from "@tabler/icons-react";
import { AnimatePresence, useMotionValueEvent, useScroll } from "motion/react";
import { useTranslations } from "next-intl";
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
          <div className="h-16 bg-[var(--mantine-color-body)]" />
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
            <div className="flex h-16 animate-header-entrance items-center justify-between space-x-4 rounded-xl bg-neutral-900/90 px-4 py-6 shadow">
              {cloneElement(logo, {
                className: cn(logo.props.className, {
                  "cursor-pointer": pathname !== homeLink,
                }),
                onClick: handleLogoClick,
              })}

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

              <div className="flex gap-4 max-md:hidden">
                {mainLinks.map(({ label, href, children }) => (
                  <Menu
                    key={label}
                    radius="md"
                    disabled={!children}
                    position="bottom-start"
                    trigger="hover"
                  >
                    <Menu.Target>
                      <Link
                        href={href}
                        scroll
                        className={cn(
                          "relative flex items-center space-x-1 text-base font-medium uppercase tracking-wider text-neutral-400 underline-offset-8 transition-all hover:text-white",
                          {
                            underline: href === pathname,
                            "text-neutral-200": pathname.startsWith(href),
                          },
                        )}
                      >
                        {label}
                      </Link>
                    </Menu.Target>
                    <Menu.Dropdown
                      className="overflow-clip bg-neutral-800"
                      bd="none"
                    >
                      {children?.map((childLink) => (
                        <Menu.Item
                          key={childLink.label}
                          component={Link}
                          href={childLink.href}
                          scroll
                          className={cn(
                            "relative flex items-center space-x-1 text-base font-medium uppercase tracking-wider text-neutral-400 transition-all hover:text-mocha-500",
                            {
                              "text-white": pathname === childLink.href,
                            },
                          )}
                        >
                          {childLink.label}
                        </Menu.Item>
                      ))}
                    </Menu.Dropdown>
                  </Menu>
                ))}
                <Menu
                  radius="md"
                  position="bottom"
                  classNames={{
                    itemLabel: "text-center",
                    dropdown: "bg-neutral-800 border-none",
                  }}
                >
                  <Menu.Target>
                    <ActionIcon
                      variant="transparent"
                      color="gray.5"
                      className="-ml-1"
                      aria-label={t("aria.langSwitch")}
                    >
                      <IconWorld stroke={1.5} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    {locales.map((option) => (
                      <Menu.Item
                        key={option}
                        color={locale === option ? "mocha" : "gray"}
                        fw={locale === option ? 600 : 500}
                        onClick={() => handleLocaleChange(option)}
                      >
                        {option.toUpperCase()}
                      </Menu.Item>
                    ))}
                  </Menu.Dropdown>
                </Menu>
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
      <FocusTrap.InitialFocus />
      <ActionIcon
        variant="transparent"
        className={cn("text-white", triggerClassName)}
        onClick={open}
        aria-label="Open navigation"
      >
        <IconMenu />
      </ActionIcon>
      <Drawer
        opened={opened}
        position="bottom"
        onClose={close}
        padding={0}
        withCloseButton={false}
        size="xs"
        classNames={{
          content: "bg-neutral-600 rounded-t-xl",
        }}
      >
        <div className="mb-6 flex items-center justify-between bg-neutral-700 p-4">
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

          <SegmentedControl
            classNames={{
              root: "bg-white/20",
              label: "text-white",
            }}
            withItemsBorders={false}
            color="mocha"
            data={locales.map((locale) => ({
              label: locale.toUpperCase(),
              value: locale,
            }))}
            value={locale}
            onChange={onLocaleChange}
          />
        </div>
        <div className="mb-6 grid grid-cols-2 gap-4 px-4">
          {mainLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={close}
              className={cn(
                "block rounded-lg border-2 border-current py-3 text-center text-xl font-light tracking-wider text-neutral-300 transition-transform active:scale-95",
                { "text-mocha-500": pathname.startsWith(href) },
              )}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="flex w-full flex-nowrap justify-between gap-4 overflow-x-auto overscroll-x-contain border-t p-4">
          {subLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={close}
              className={cn(
                "text-nowrap text-neutral-400 underline-offset-4 hover:underline",
                { "text-mocha-500": pathname.startsWith(href) },
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      </Drawer>
    </>
  );
}
