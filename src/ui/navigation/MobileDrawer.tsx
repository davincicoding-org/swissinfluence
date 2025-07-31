import Image from "next/image";
import { useTranslations } from "next-intl";

import type { NavigationConfig } from "@/types";
import { Link } from "@/i18n/navigation";
import { cn } from "@/ui/utils";

interface MobileNavigationProps {
  config: NavigationConfig;
  locale: string;
  locales: ReadonlyArray<string>;
  opened: boolean;
  onClose: () => void;
  pathname: string;
  onLocaleChange: (nextLocale: string | null) => void;
}

export function MobileNavigation({
  config,
  locale,
  locales,
  pathname,
  onLocaleChange,
  opened,
  onClose,
}: MobileNavigationProps) {
  const t = useTranslations("misc");

  return (
    <dialog open={opened} onClose={onClose} className="modal modal-bottom">
      <div className="modal-box bg-neutral/70 p-0 backdrop-blur-sm">
        <div className="mb-6 flex items-center justify-between p-4">
          <Link href={config.homeLink} onClick={onClose} className="shrink-0">
            <Image
              unoptimized
              src={config.mainLogo}
              className="h-12 w-auto translate-y-1"
              alt="Logo"
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
          {config.mainLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={onClose}
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
          {config.subLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={onClose}
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
        <button>{t("close-modal")}</button>
      </form>
    </dialog>
  );
}
