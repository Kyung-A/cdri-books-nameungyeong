import { useInfiniteQuery } from "@tanstack/react-query";
import { getBooks } from "../apis";
import { IBook, IBooksData } from "@/shared/types";

export function useBooks(filters: string) {
  return useInfiniteQuery<IBooksData>({
    queryKey: ["books", filters],
    queryFn: async ({ pageParam }): Promise<IBooksData> => {
      const { documents, meta } = await getBooks(
        `${filters}&page=${pageParam}&size=10`
      );

      const result = documents.map((v: IBook) => ({
        ...v,
        active: false,
        bookmark: false,
      }));

      return {
        documents: result,
        meta: {
          ...meta,
          page: pageParam,
        },
      };
    },
    initialPageParam: 1,
    getNextPageParam: (last) =>
      !last.meta?.is_end && last.meta?.page ? last.meta.page + 1 : undefined,
    enabled: Boolean(filters),
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });
}
