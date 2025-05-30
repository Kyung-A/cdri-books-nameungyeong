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
  const handleClickDetail = useCallback(
    (book: IBook) => {
      const newData = data?.map((v) =>
        v.url === book.url ? { ...v, active: !v.active } : v
      );
      setData((prev) => ({ ...prev, documents: newData }));
    },
    [data, setData]
  );

  const handleClickBookmark = useCallback(
    (book: IBook) => {
      const newBookmarkState = !book.bookmark;
      const newBookData = { ...book, bookmark: newBookmarkState };

      setData((prev) => ({
        ...prev,
        documents: prev?.documents?.map((v) =>
          v.url === book.url ? newBookData : v
        ),
      }));

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
