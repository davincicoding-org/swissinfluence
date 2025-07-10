import type { BoxProps } from "@mui/material";
import type {
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  Ref,
} from "react";
import type { Identifier, RaRecord, SortPayload } from "react-admin";
import type { DeepPartial } from "react-hook-form";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Box, Button, Card, Divider, IconButton } from "@mui/material";
import { IconX } from "@tabler/icons-react";
import {
  RecordContextProvider,
  ResourceContext,
  useCreate,
  useDelete,
  useGetManyReference,
  useRecordContext,
  useUpdate,
} from "react-admin";
import { FormProvider, useForm } from "react-hook-form";

export type ReferenceFormComponent<T extends RaRecord> = FunctionComponent<{
  references: T[];
}>;

export interface ReferenceManyInputProps<T extends RaRecord> extends BoxProps {
  reference: string;
  target: string;
  disableAdd?: boolean;
  disableRemove?: boolean;
  sort?: SortPayload;
  render?: ReferenceFormComponent<T>;
  children?: ReactNode;
}
export function ReferenceManyInput<T extends RaRecord>({
  reference,
  target,
  sort,
  disableAdd,
  disableRemove,
  render: DynamicChildren,
  children,
  sx,
  ...boxProps
}: ReferenceManyInputProps<T>) {
  const record = useRecordContext();
  // FIXME Error: Maximum update depth exceeded.
  const { data: references = [] } = useGetManyReference<T>(
    reference,
    {
      target: target,
      id: record?.id,
      sort,
    },
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  );

  const [createReference] = useCreate();
  const [updateReference] = useUpdate();
  const [deleteReference] = useDelete();

  const addingFormRef = useRef<{ reset: () => void }>(null);
  const [adding, setAdding] = useState(false);

  return (
    <ResourceContext.Provider value={reference}>
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 1, ...sx }}
        {...boxProps}
      >
        {references.map(({ id, ...data }) => (
          <ReferenceForm
            key={id}
            id={id}
            values={{ [target]: record?.id, ...data }}
            onUpdate={(updates) =>
              updateReference(reference, {
                id: id,
                data: updates,
                previousData: { [target]: record?.id, ...data },
              })
            }
          >
            <Card
              variant="outlined"
              sx={{
                padding: 1,
                pl: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              {DynamicChildren ? (
                <DynamicChildren references={references} />
              ) : (
                children
              )}
              {!disableRemove && (
                <IconButton
                  size="small"
                  color="error"
                  sx={{ ml: "auto" }}
                  onClick={() => deleteReference(reference, { id })}
                >
                  <IconX size={16} />
                </IconButton>
              )}
            </Card>
          </ReferenceForm>
        ))}

        {!disableAdd && (
          <>
            {adding ? (
              <>
                <Divider />

                <ReferenceForm
                  ref={addingFormRef}
                  values={{ [target]: record?.id }}
                  onUpdate={(updates) =>
                    createReference(
                      reference,
                      {
                        data: updates,
                      },
                      { onSuccess: addingFormRef.current?.reset },
                    )
                  }
                >
                  <Card
                    variant="outlined"
                    sx={{
                      padding: 1,
                      pl: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      justifyContent: "space-between",
                    }}
                  >
                    {DynamicChildren ? (
                      <DynamicChildren references={references} />
                    ) : (
                      children
                    )}
                  </Card>
                </ReferenceForm>
              </>
            ) : (
              <Button
                variant="outlined"
                size="large"
                sx={{ mt: 4 }}
                onClick={() => setAdding(true)}
              >
                Add
              </Button>
            )}
          </>
        )}
      </Box>
    </ResourceContext.Provider>
  );
}

function ReferenceForm<T extends Record<string, unknown>>({
  values,
  id,
  children,
  ref,
  onUpdate,
}: PropsWithChildren<{
  values: T;
  id?: Identifier;
  ref?: Ref<{ reset: () => void }>;
  onUpdate: (values: DeepPartial<T>) => void;
}>) {
  const form = useForm({ values, mode: "onTouched" });

  const validating = useRef(false);

  useImperativeHandle(ref, () => ({
    reset: () => form.reset(),
  }));

  useEffect(() => {
    const subscription = form.watch((updated, { name }) => {
      if (!name) return;

      if (validating.current) return;
      validating.current = true;

      void (async () => {
        const ok = await form.trigger(name);
        validating.current = false;

        if (!ok) return;

        onUpdate(updated);
      })();
    });

    return subscription.unsubscribe; // clean up on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, values.id]);

  return (
    <RecordContextProvider value={{ id, ...values }}>
      <FormProvider {...form}>{children}</FormProvider>
    </RecordContextProvider>
  );
}
