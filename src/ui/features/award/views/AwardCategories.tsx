"use client";

import type { ReactNode } from "react";
import { Children } from "react";
import Image from "next/image";
import { Button, Paper } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
// import Autoplay from "embla-carousel-autoplay";
import { useLocale } from "next-intl";
import Marquee from "react-fast-marquee";

import type { AwardCategory } from "@/types";
import { PersonaCard } from "@/ui/components/PersonaCard";
import { cn } from "@/ui/utils";

export interface AwardCategoriesProps {
  categories: Array<AwardCategory>;
  skipTarget: string;
}

export function AwardCategories({
  categories,
  skipTarget,
}: AwardCategoriesProps) {
  return (
    <StackedCards
      title={
        <h3 className="text-center text-4xl font-extralight uppercase tracking-wider sm:text-5xl md:text-6xl">
          Categories
        </h3>
      }
      footer={
        <Button
          component="a"
          href={`#${skipTarget}`}
          variant="subtle"
          size="md"
        >
          SKIP
        </Button>
      }
    >
      {categories.map(({ category, nominees, sponsor }) => (
        <CategoryCard
          key={category.id}
          category={category}
          nominees={nominees}
          sponsor={sponsor}
        />
      ))}
    </StackedCards>
  );
}

function StackedCards({
  title,
  children,
  footer,
}: {
  children: Array<ReactNode>;
  title: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="-mb-[25dvh] grid gap-32 pb-[25dvh]">
      <div className="sticky top-0 grid justify-stretch pt-32">{title}</div>
      {Children.map(children, (child) => (
        <div className="sticky top-0 -mb-[25dvh] grid h-dvh items-center justify-stretch">
          {child}
        </div>
      ))}
      <div className="sticky bottom-0 -mb-[25dvh] flex items-end justify-center p-8">
        {footer}
      </div>
    </div>
  );
}

function CategoryCard({
  category,
  nominees,
  sponsor,
}: Pick<AwardCategory, "category" | "nominees" | "sponsor">) {
  // const autoplay = useRef(Autoplay({ delay: 2000 }));
  // TODO should autoplay if it is on top of stack

  const locale = useLocale();
  // const [selectedNominee, setSelectedNominee] = useState<number>();

  // useEffect(() => {
  //   if (!isExpanded) return;
  //   autoplay.current.stop();
  // }, [isExpanded]);

  // const handleNomineeClick = (e: MouseEvent, nomineeIndex: number) => {
  //   e.stopPropagation();
  //   expand();
  //   setSelectedNominee(nomineeIndex);
  // };
  // const marqueeRef = useRef<HTMLDivElement>(null);
  // const isMarqueeInView = useInView(marqueeRef, { amount: "some" });
  // TODO pause marque if it is not visible (not in viewport or covered by other card)

  return (
    <Paper withBorder radius="lg" className="min-w-0 overflow-clip">
      <div className="relative">
        <Image
          src={category.image.src}
          alt={category.title[locale]!}
          fill
          className="absolute inset-0 object-cover object-center"
        />
        <div
          className={cn(
            "relative z-10 flex h-64 flex-col justify-end bg-gradient-to-t from-black/60 from-30% to-black/0 p-4 text-left md:h-64",
            { "h-32 md:h-48": nominees.length },
          )}
        >
          <h3 className="text-2xl font-medium text-white md:text-5xl">
            {category.title[locale]}
          </h3>
          {sponsor && (
            <p className="text-sm text-gray-200 md:text-lg">
              Sponsored by {sponsor.name}
            </p>
          )}
        </div>
      </div>
      {nominees.length > 0 && (
        <Marquee className="py-6 md:py-8" pauseOnHover autoFill>
          {nominees.map(({ influencer }) => (
            <PersonaCard
              key={influencer.id}
              name={influencer.name}
              image={influencer.image}
              // @ts-expect-error - FIXME
              socials={influencer.socials}
              className="ml-6 h-64 w-64 md:ml-8"
            />
          ))}
        </Marquee>
      )}
    </Paper>
  );

  // return (
  //   <motion.div
  //     layout
  //     onClick={expand}
  //     className={cn(
  //       "pointer-events-auto relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow",
  //       { "max-md:cursor-pointer": !isExpanded },
  //     )}
  //   >
  //     {/* Header Section */}
  //     <motion.div layout className="relative aspect-video h-64 shrink-0">
  //       {/* Background Image */}
  //       <Image
  //         src={category.image.src}
  //         alt={category.title[locale]!}
  //         fill
  //         className="absolute inset-0 object-cover object-center"
  //       />

  //       {/* Gradient Overlay */}
  //       <div className="absolute inset-0 top-2/3 bg-gradient-to-t from-black/60 to-black/0" />

  //       {/* Sponsor Logo */}
  //       {/*<div className="absolute right-4 top-4 rounded-lg bg-white/90 p-2 backdrop-blur-sm">*/}
  //       {/*  <img*/}
  //       {/*    src={category.sponsor?.image.src}*/}
  //       {/*    alt={`${category.sponsor?.name} logo`}*/}
  //       {/*    className="h-8 w-auto object-contain"*/}
  //       {/*  />*/}
  //       {/*</div>*/}

  //       {/* Category Title and Sponsor */}
  //       <div className="absolute bottom-0 left-0 right-0 grid p-4 text-left md:gap-1 md:p-6">
  //         <motion.h3
  //           layout
  //           className="text-5xl font-semibold text-white md:text-6xl"
  //         >
  //           {category.title[locale]}
  //         </motion.h3>
  //         {sponsor && (
  //           <motion.p layout className="text-sm text-gray-200 md:text-lg">
  //             Sponsored by {sponsor.name}
  //           </motion.p>
  //         )}
  //       </div>
  //     </motion.div>

  //     {/* Content Section */}
  //     {/* <motion.div
  //       layout
  //       className="flex hidden min-w-0 shrink flex-col md:hidden"
  //     >
  //       <Marquee
  //         gradient={false}
  //         speed={40}
  //         className="py-4"
  //         autoFill
  //         pauseOnHover
  //       >
  //         <div className="flex gap-4 pr-4">
  //           {influencers.map((nominee, nomineeIndex) => (
  //             <div
  //               key={nominee.id}
  //               className="aspect-square w-24 shrink-0 cursor-pointer transition-transform hover:scale-105"
  //               onClick={(e) => handleNomineeClick(e, nomineeIndex)}
  //             >
  //               <img
  //                 src={nominee.image.src}
  //                 alt={nominee.name}
  //                 className="h-full w-full rounded-lg object-cover"
  //               />
  //             </div>
  //           ))}
  //         </div>
  //       </Marquee>
  //     </motion.div> */}

  //     {/* <div
  //       className={cn({
  //         "max-md:hidden": !isExpanded,
  //       })}
  //     >
  //       <ActionIcon
  //         onClick={(e) => {
  //           e.stopPropagation();
  //           setSelectedNominee(undefined);
  //           collapse();
  //         }}
  //         radius="xl"
  //         color="default"
  //         variant="light"
  //         size="lg"
  //         className="absolute right-2 top-2 z-30 text-white transition-colors hover:text-gray-300 md:hidden"
  //       >
  //         <IconX size={20} />
  //       </ActionIcon>

  //       <Carousel
  //         emblaOptions={{ loop: true }}
  //         initialSlide={selectedNominee ?? 0}
  //         withControls
  //         // plugins={[autoplay.current]}
  //         className="pointer-events-auto inset-0 z-20 max-md:absolute md:aspect-square"
  //         onMouseEnter={() => autoplay.current.stop()}
  //         onMouseLeave={() => autoplay.current.play()}
  //         styles={{
  //           root: { height: "100%" },
  //           viewport: { height: "100%" },
  //           container: { height: "100%" },
  //           slide: { height: "100%" },
  //           control: {
  //             color: "white",
  //             backgroundColor: "rgba(255, 255, 255, 0.1)",
  //             border: "none",
  //             "&:hover": {
  //               backgroundColor: "rgba(255, 255, 255, 0.2)",
  //             },
  //           },
  //         }}
  //       >
  //         {influencers.map((nominee) => (
  //           <Carousel.Slide key={nominee.id}>
  //             <PersonaCard
  //               name={nominee.name}
  //               image={nominee.image}
  //               // @ts-expect-error - FIXME
  //               socials={nominee.socials}
  //               className="h-full md:rounded-none"
  //               revealed
  //             />
  //           </Carousel.Slide>
  //         ))}
  //       </Carousel>
  //     </div> */}
  //   </motion.div>
  // );
}
