import { IBook, IBooksMeta } from "@/shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface IToggleDetail {
  filters?: string;
  book: IBook;
}

export function useToggleDetail() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, IToggleDetail>({
    mutationFn: async ({ filters, book }) => {
      const queryKey = ["books", filters];

      const prev = queryClient.getQueryData<{
        pages: { documents: IBook[]; meta: IBooksMeta }[];
        pageParams: unknown[];
      }>(queryKey);

      if (!prev) return;

      const newData = prev.pages.map((page) => ({
        documents: page.documents.map((v) =>
          v.url === book.url ? { ...v, active: !v.active } : v
        ),
        meta: page.meta,
      }));

      queryClient.setQueryData(queryKey, {
        pages: newData,
        pageParams: prev.pageParams,
      });
    },
  });
}
