import { IBook, ISearchFilter } from "@/shared/types";
import { useCallback } from "react";

import Books from "./Books";
import BookListEmpty from "./BookListEmpty";
import { useToggleBookmark, useToggleDetail } from "../queries";

interface IBooksContainer {
  data?: IBook[];
  totalCount?: number;
  filters?: ISearchFilter;
}

export default function BooksContainer({
  data,
  totalCount = 0,
  filters,
}: IBooksContainer) {
  const toggleBookmarkMutation = useToggleBookmark();
  const toggleDetailMutation = useToggleDetail();

  const handleClickDetail = useCallback(
    (book: IBook) => {
      toggleDetailMutation.mutate({ filters, book });
    },
    [filters, toggleDetailMutation]
  );

  const handleClickBookmark = useCallback(
    (book: IBook) => {
      toggleBookmarkMutation.mutate({ filters, book });
    },
    [filters, toggleBookmarkMutation]
  );

  return (
    <>
      <div className="mt-6 flex items-center gap-x-4">
        <p className="font-medium">도서 검색 결과</p>
        <p>
          총 <span className="text-blue-500">{totalCount}</span>건
        </p>
      </div>
      {data && data.length > 0 ? (
        <Books
          data={data}
          handleClickDetail={handleClickDetail}
          handleClickBookmark={handleClickBookmark}
        />
      ) : (
        <BookListEmpty />
      )}
    </>
  );
}
