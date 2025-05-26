"use client";

import type { ReactNode } from "react";
import { useState } from "react";
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
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/ui/utils";

export interface INavigationProps {
  homeLink: string;
  locale: string;
  mainLogo: ReactNode;
  locales: ReadonlyArray<string>;
  mainLinks: Array<{
    label: string;
    href: string;
    logo?: ReactNode;
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
}: INavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { scrollY } = useScroll();

  const [visible, setVisible] = useState(true);

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
    if (typeof current === "number") {
      const direction = current - (scrollY.getPrevious() ?? 0);

      if (scrollY.get() === 0) {
        setVisible(true);
      } else if (direction < 0) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }
  });

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
        <motion.div
          initial={{
            y: -100,
          }}
          animate={{
            y: visible ? 0 : -100,
          }}
          transition={{
            duration: 0.5,
          }}
          className={cn("fixed inset-x-0 top-0 z-10")}
        >
          <div className="h-16 bg-[var(--mantine-color-body)]" />
        </motion.div>
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{
            opacity: 1,
            y: -100,
          }}
          animate={{
            y: visible ? 0 : -100,
            opacity: visible ? 1 : 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className={cn("fixed inset-x-0 top-8 z-30")}
        >
          <div className="container">
            <div className="flex h-16 items-center justify-between space-x-4 rounded-xl bg-neutral-900/90 px-4 py-6 shadow backdrop-blur">
              <Link
                href={homeLink}
                className={cn({
                  "pointer-events-none": pathname === homeLink,
                })}
              >
                {activeLink?.logo ?? mainLogo}
              </Link>
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
                            "relative flex items-center space-x-1 text-base font-medium uppercase tracking-wider text-neutral-400 underline-offset-4 transition-all hover:text-mocha-500",
                            {
                              "text-neutral-200 underline":
                                pathname === childLink.href,
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
                  position="bottom"
                  classNames={{ dropdown: "bg-neutral-800 border-none" }}
                >
                  <Menu.Target>
                    <ActionIcon
                      variant="transparent"
                      color="gray"
                      className="-ml-1"
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
        </motion.div>
      </AnimatePresence>
    </>
  );
}

// MARK: Mobile Navigation

interface IMobileNavigationProps extends Omit<INavigationProps, "mainLogo"> {
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
  ...rest
}: IMobileNavigationProps) {
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
              src="$/logos/main.svg"
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
