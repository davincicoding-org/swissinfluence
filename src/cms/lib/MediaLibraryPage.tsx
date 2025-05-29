import type { Identifier } from "react-admin";
import { useEffect, useRef, useState } from "react";
import { ImageInput } from "@davincicoding/cms/image";
import { VideoInput } from "@davincicoding/cms/video";
import { Box, Tab, Tabs } from "@mui/material";
import {
  RecordContext,
  ResourceContext,
  useGetList,
  useUpdate,
} from "react-admin";
import { FormProvider, useForm } from "react-hook-form";

import type {
  ImageAsset,
  MediaLibraryConfig,
  VideoAsset,
} from "./media-library";

export interface MediaLibraryPageProps {
  config: MediaLibraryConfig;
}

export function MediaLibraryPage({ config }: MediaLibraryPageProps) {
  const [group, setGroup] = useState<string>(Object.keys(config)[0] ?? "");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setGroup(newValue);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Tabs
        value={group}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        {Object.keys(config).map((group) => (
          <Tab key={group} label={group} value={group} />
        ))}
      </Tabs>
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {Object.entries(config[group] ?? {}).map(([name, type]) => (
          <MediaEditor key={name} group={group} name={name} type={type} />
        ))}
      </Box>
    </Box>
  );
}
type MediaRecord =
  | (ImageAsset & { id: Identifier })
  | (VideoAsset & { id: Identifier });

function MediaEditor({
  type,
  group,
  name,
}: {
  type: "image" | "video";
  name: string;
  group: string;
}) {
  const resource =
    type === "image" ? "images" : type === "video" ? "videos" : "";
  const { data: [record] = [] } = useGetList<MediaRecord>(resource, {
    filter: {
      group: group,
      name: name,
    },
    pagination: {
      page: 1,
      perPage: 1,
    },
  });
  const form = useForm<{ file: MediaRecord | undefined }>({
    values: { file: record },
  });
  const validating = useRef(false);
  const [updateMedia] = useUpdate<MediaRecord>();

  useEffect(() => {
    const subscription = form.watch(({ file }, { name }) => {
      if (!name) return;
      if (!file) return;

      if (validating.current) return;
      validating.current = true;

      void (async () => {
        const ok = await form.trigger(name);
        validating.current = false;

        if (!ok) return;

        const { id, ...data } = file;

        switch (type) {
          case "image":
            if (!("blurDataURL" in file)) return;
            await updateMedia("images", {
              id,
              data,
            });
            break;
          case "video":
            await updateMedia("videos", {
              id,
              data,
            });
            break;
        }
      })();
    });
    return subscription.unsubscribe;
  }, [form, record?.id, updateMedia, type]);

  return (
    <ResourceContext value={resource}>
      {record && (
        <RecordContext value={record}>
          <FormProvider {...form}>
            {type === "image" && <ImageInput label={name} source="file" />}
            {type === "video" && <VideoInput label={name} source="file" />}
          </FormProvider>
        </RecordContext>
      )}
    </ResourceContext>
  );
}
