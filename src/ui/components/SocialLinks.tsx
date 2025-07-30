import type { MouseEvent } from "react";
import { useMemo } from "react";
import { IconDotsVertical } from "@tabler/icons-react";

import type { Socials } from "@/payload-types";

import { cn } from "../utils";
import { SocialMediaPlatformIcon } from "./SocialMediaPlatformIcon";

export interface SocialsLinksProps {
  className?: string;
  classNames?: Partial<Record<"root" | "item" | "dropdown" | "icon", string>>;
  items: NonNullable<Socials>;
  direction?: "row" | "column";
  maxItems?: number;
  onItemClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export function SocialsLinks({
  items,
  maxItems,
  direction = "row",
  className,
  classNames,
  onItemClick,
}: SocialsLinksProps) {
  const { displayedItems, hiddenItems } = useMemo<
    Record<"displayedItems" | "hiddenItems", NonNullable<Socials>>
  >(() => {
    if (maxItems === undefined || items.length <= maxItems)
      return {
        displayedItems: items,
        hiddenItems: [],
      };

    return {
      displayedItems: items.slice(0, 1),
      hiddenItems: items.slice(1),
    };
  }, [items, maxItems]);

  return (
    <ul
      className={cn(
        "flex",
        {
          "flex-col-reverse": direction === "column",
        },
        className,
        classNames?.root,
      )}
    >
      {displayedItems.map((social) => (
        <li key={social.platform}>
          <a
            className={cn(
              "btn btn-square border-none shadow-none btn-ghost btn-lg hover:bg-primary/10 hover:text-primary",
              classNames?.item,
            )}
            href={social.url}
            target="_blank"
            // TODO i18n
            aria-label={`Link to ${social.platform}`}
            onClick={onItemClick}
          >
            <SocialMediaPlatformIcon
              platform={social.platform}
              className={cn("transition-all duration-250", classNames?.icon)}
              stroke={1.25}
            />
          </a>
        </li>
      ))}

      {hiddenItems.length > 0 ? (
        <li
          className={cn("dropdown dropdown-center", {
            "dropdown-top": direction === "row",
            "dropdown-left": direction === "column",
          })}
        >
          <button
            className={cn(
              "btn btn-square border-none shadow-none btn-ghost btn-lg hover:bg-primary/10 hover:text-primary focus:opacity-0",
              classNames?.item,
            )}
            // TODO i18n
            aria-label="More social links"
          >
            <IconDotsVertical
              className={cn(
                "scale-75 transition-all duration-200",
                classNames?.icon,
              )}
            />
          </button>
          <ul
            className={cn(
              "dropdown-content menu join gap-0.5 rounded-field p-0",
              {
                "!right-0 !flex-row !flex-nowrap": direction === "column",
                "!bottom-0 join-vertical": direction === "row",
              },
              classNames?.dropdown,
            )}
          >
            {hiddenItems.map((social) => (
              <li key={social.platform} className="">
                <a
                  href={social.url}
                  target="_blank"
                  className={cn(
                    "btn join-item btn-square border-none p-0 shadow-none btn-ghost btn-lg hover:bg-primary/10 hover:text-primary",
                    classNames?.item,
                  )}
                  onClick={onItemClick}
                >
                  <SocialMediaPlatformIcon
                    platform={social.platform}
                    className={cn(
                      "transition-all duration-200",
                      classNames?.icon,
                    )}
                    stroke={1.25}
                  />
                </a>
              </li>
            ))}
          </ul>
        </li>
      ) : null}
    </ul>
  );
}
