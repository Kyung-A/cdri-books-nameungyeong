import axios from "axios";
import { IBooksData, IBook } from "@/shared/types";
import { useState, useCallback, useEffect } from "react";
import Books from "./Books";
import BookListEmpty from "./BookListEmpty";

export default function BooksContainer() {
  const [data, setData] = useState<IBooksData>();

  const fetchData = useCallback(async () => {
    const {
      data: { documents, meta },
    } = await axios.get("https://dapi.kakao.com/v3/search/book?query=정보", {
      headers: {
        Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API}`,
      },
    });

    const data = documents.map((v: IBook) => ({
      ...v,
      active: false,
      bookmark: false,
    }));
    setData({ documents: data, meta });
  }, []);

  const handleClickBookmark = useCallback(
    (book: IBook) => {
      const newData = data?.documents?.map((v) =>
        v.isbn === book.isbn ? { ...v, active: !v.active } : v
      );
      setData({ meta: data?.meta, documents: newData });
    },
    [data]
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {data ? (
        <Books
          data={data?.documents}
          handleClickBookmark={handleClickBookmark}
        />
      ) : (
        <BookListEmpty />
      )}
    </>
  );
}
