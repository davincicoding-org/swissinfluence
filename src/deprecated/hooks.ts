import { useMemo } from "react";

import { useGetList } from "react-admin";

export interface IDocumentChoice {
  id: string;
  name: string;
}

export function useDocumentChoices<T extends { id: string }>(
  resource: string,
  getName: (doc: T) => string,
) {
  const { data = [], isLoading } = useGetList<T>(resource, {
    pagination: { page: 1, perPage: 10_000 },
  });
  const items = useMemo(
    () =>
      data.map<IDocumentChoice>((doc) => ({ id: doc.id, name: getName(doc) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  );

  return {
    items,
    loading: isLoading,
  };
}
