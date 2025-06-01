import { IBook } from "@/shared/types";
import { Dispatch, SetStateAction, useCallback } from "react";

import Books from "./Books";
import BookListEmpty from "./BookListEmpty";

interface IBookMarkContainer {
  data?: IBook[];
  setData: Dispatch<SetStateAction<IBook[] | undefined>>;
  totalCount: number;
}

export default function BookMarkContainer({
  data,
  setData,
  totalCount,
}: IBookMarkContainer) {
  const handleClickDetail = useCallback(
    (book: IBook) => {
      const newData = data?.map((v) =>
        v.url === book.url ? { ...v, active: !v.active } : v
      );
      setData(newData);
    },
    [data, setData]
  );

  const handleClickBookmark = useCallback(
    (book: IBook) => {
      const newBookmarkState = !book.bookmark;
      const newBookData = { ...book, bookmark: newBookmarkState };

      setData((prev) =>
        prev?.map((v) => (v.url === book.url ? newBookData : v))
      );

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
    [setData]
  );

  return (
    <>
      <div className="mt-6 flex items-center gap-x-4">
        <p className="font-medium">찜한 책</p>
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
