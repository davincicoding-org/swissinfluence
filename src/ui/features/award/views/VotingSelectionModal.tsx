"use client";

import { useMemo } from "react";
import {
  ActionIcon,
  Button,
  CloseButton,
  Divider,
  Indicator,
  Modal,
  NavLink,
  Paper,
  Popover,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { IconList, IconX } from "@tabler/icons-react";
import { isEqual } from "lodash-es";
import { AnimatePresence, motion } from "motion/react";

import type { Category, Influencer, ProfilePicture } from "@/payload-types";
import type { AwardCategory, InfluencerVote, VotingValues } from "@/types";
import { PersonaCard } from "@/ui/components/PersonaCard";
import { cn } from "@/ui/utils";

export interface VotingSelectionModalProps {
  categories: AwardCategory[];
  votes: VotingValues["votes"];
  onToggleVote: (vote: InfluencerVote) => void;
  opened: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

// TODO i18n

export function VotingSelectionModal({
  categories,
  votes,
  onToggleVote,
  opened,
  onClose,
  onSubmit,
}: VotingSelectionModalProps) {
  const selectedInfluencers = useMemo<
    {
      category: Pick<Category, "id" | "name">;
      influencers: Array<Pick<Influencer, "id" | "name">>;
    }[]
  >(
    () =>
      categories
        .map(({ nominees, category }) => ({
          category,
          influencers: nominees.filter((nominee) =>
            votes.some((vote) =>
              isEqual(vote, { influencer: nominee.id, category: category.id }),
            ),
          ),
        }))
        .filter(({ influencers }) => influencers.length > 0),
    [categories, votes],
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      radius="lg"
      withCloseButton={false}
      classNames={{
        body: "p-0",
      }}
    >
      <div className="grid gap-6 p-4">
        {categories.map(({ category, nominees }) => {
          if (nominees.length === 0) return null;
          return (
            <div key={category.id} className="flex flex-col gap-4">
              <h3 className="text-4xl">{category.name}</h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                {nominees.map((nominee) => (
                  <PersonaCard
                    key={nominee.id}
                    role="button"
                    tabIndex={0}
                    className={cn(
                      "cursor-pointer opacity-70 transition-all hover:opacity-100",
                      {
                        "border-8 border-mocha-500 opacity-100": votes.some(
                          (vote) =>
                            isEqual(vote, {
                              influencer: nominee.id,
                              category: category.id,
                            }),
                        ),
                      },
                    )}
                    onClick={() =>
                      onToggleVote({
                        influencer: nominee.id,
                        category: category.id,
                      })
                    }
                    name={nominee.name}
                    image={nominee.image as ProfilePicture}
                    revealed
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="sticky bottom-0 z-10 flex h-16 items-center justify-between gap-2 bg-white/80 px-4 py-3">
        <AnimatePresence mode="wait">
          {votes.length > 0 ? (
            <>
              <Popover position="top-start" offset={0} radius="md">
                <Popover.Target>
                  <Indicator
                    label={votes.length}
                    size={16}
                    offset={4}
                    classNames={{ indicator: "font-medium" }}
                  >
                    <ActionIcon
                      key="list"
                      size="xl"
                      variant="subtle"
                      radius="md"
                      className={cn("text-current transition-opacity", {
                        "pointer-events-none opacity-0": votes.length === 0,
                      })}
                      component={motion.button}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <IconList size={32} stroke={1.5} />
                    </ActionIcon>
                  </Indicator>
                </Popover.Target>
                <Popover.Dropdown
                  p={0}
                  className="!bg-white/30 backdrop-blur-sm"
                >
                  <ScrollArea
                    scrollbars="y"
                    classNames={{
                      viewport: "max-h-96",
                    }}
                  >
                    <Stack gap={8} p="xs">
                      {selectedInfluencers.map(({ category, influencers }) => (
                        <Paper
                          key={category.id}
                          withBorder
                          radius="md"
                          className="overflow-clip !bg-white/50"
                        >
                          {/* <Divider label={category.name} /> */}
                          <Text
                            c="white"
                            size="sm"
                            bg="mocha.3"
                            className="px-2 py-1.5 font-medium"
                          >
                            {category.name}
                          </Text>
                          <Divider />
                          <AnimatePresence>
                            {influencers.map((influencer) => (
                              <NavLink
                                key={influencer.id}
                                label={influencer.name}
                                component={motion.button}
                                exit={{ opacity: 0, x: 10 }}
                                rightSection={<IconX size={16} />}
                                py={4}
                                px="xs"
                                onClick={() =>
                                  onToggleVote({
                                    influencer: influencer.id,
                                    category: category.id,
                                  })
                                }
                              />
                            ))}
                          </AnimatePresence>
                        </Paper>
                      ))}
                    </Stack>
                  </ScrollArea>
                </Popover.Dropdown>
              </Popover>

              <Button
                key="submit"
                radius="md"
                size="md"
                component={motion.button}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onSubmit}
              >
                Submit Votes
              </Button>
            </>
          ) : (
            <motion.span
              key="info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-balance text-lg font-medium leading-tight"
            >
              Select all the Nominees you&apos;d like to vote for
            </motion.span>
          )}
        </AnimatePresence>
        <CloseButton size="xl" radius="md" onClick={onClose} />
      </div>
    </Modal>
  );
}
