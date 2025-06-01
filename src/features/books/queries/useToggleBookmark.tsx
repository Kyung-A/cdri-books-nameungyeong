import { IBook, IBooksMeta } from "@/shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface IToggleDetail {
  filters?: string;
  book: IBook;
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, IToggleDetail>({
    mutationFn: async ({ filters, book }) => {
      const newBookmarkState = !book.bookmark;
      const newBookData = { ...book, bookmark: newBookmarkState };

      const queryKey = ["books", filters];
      const prev = queryClient.getQueryData<{
        pages: { documents: IBook[]; meta: IBooksMeta }[];
        pageParams: unknown[];
      }>(queryKey);

      if (prev) {
        const newData = prev?.pages.map((page) => ({
          documents: page.documents.map((v) =>
            v.url === book.url ? newBookData : v
          ),
          meta: page.meta,
        }));
        queryClient.setQueryData(queryKey, {
          pages: newData,
          pageParams: prev.pageParams,
        });
      }

      const raw = localStorage.getItem("bookmark");
      const list: IBook[] = raw ? JSON.parse(raw) : [];

      if (newBookmarkState) {
        const exists = list.some((v) => v.url === book.url);
        if (!exists) {
          list.push(newBookData);
        }
      } else {
        const filtered = list.filter((v) => v.url !== book.url);
        localStorage.setItem("bookmark", JSON.stringify(filtered));
        return;
      }

      localStorage.setItem("bookmark", JSON.stringify(list));
    },
  });
}
