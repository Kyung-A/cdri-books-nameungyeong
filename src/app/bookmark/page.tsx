"use client";
import { useCallback, useEffect, useRef, useState } from "react";

import { BookMarkList } from "@/features/books/ui";
import { useInfiniteScroll } from "@/shared/hooks";
import { IBook } from "@/shared/types";

export default function Home() {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const totalCount = useRef<IBook[]>([]);

  const [data, setData] = useState<IBook[]>();
  const [paging, setpaging] = useState<number>(1);

  const fetchData = useCallback(async () => {
    const localData = JSON.parse(localStorage.getItem("bookmark") as string);
    if (!localData) return;

    const result = localData.map((v: IBook) => ({
      ...v,
      active: false,
      bookmark: true,
    }));

    totalCount.current = result;
    setData(result.slice(0, 10));
  }, []);

  const loadMoreData = useCallback(() => {
    if (data?.length === totalCount.current.length) return;
    setData((prev) => [
      ...(prev || []),
      ...totalCount.current.slice((paging - 1) * 10, paging * 10),
    ]);
  }, [data?.length, paging]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (paging === 1) return;
    loadMoreData();
  }, [paging]);

  useInfiniteScroll(loadMoreRef, () => setpaging((prev) => prev + 1));

  return (
    <>
      <h1 className="text-[22px] font-bold">내가 찜한 책</h1>
      <BookMarkList
        data={data}
        setData={setData}
        totalCount={totalCount.current.length}
      />
      <div
        ref={loadMoreRef}
        className={`py-8 ${data && data?.length > 0 ? "block" : "hidden"}`}
      ></div>
    </>
  );
}
