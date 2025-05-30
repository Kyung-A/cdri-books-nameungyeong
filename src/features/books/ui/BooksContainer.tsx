import { IBooksData, IBook } from "@/shared/types";
import { useCallback, Dispatch, SetStateAction } from "react";

import Books from "./Books";
import BookListEmpty from "./BookListEmpty";

interface IBooksContainer {
  pathname?: string;
  data?: IBook[];
  setData: Dispatch<SetStateAction<IBooksData | undefined>>;
}

export default function BooksContainer({
  data,
  setData,
  pathname,
}: IBooksContainer) {
  const handleClickBookmark = useCallback(
    (book: IBook) => {
      const newData = data?.map((v) =>
        v.isbn === book.isbn ? { ...v, active: !v.active } : v
      );
      setData((prev) => ({ ...prev, documents: newData }));
    },
    [data, setData]
  );

  return (
    <>
      <div className="mt-6 flex items-center gap-x-4">
        <p className="font-medium">
          {pathname === "/bookmark" ? "찜한 책" : "도서 검색 결과"}
        </p>
        <p>
          총 <span className="text-blue-500">{data?.length || 0}</span>건
        </p>
      </div>
      {data && data.length > 0 ? (
        <Books data={data} handleClickBookmark={handleClickBookmark} />
      ) : (
        <BookListEmpty />
      )}
    </>
  );
}
