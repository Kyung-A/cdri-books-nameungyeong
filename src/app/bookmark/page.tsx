"use client";
import { BookMarkList } from "@/features/books/ui";
import { IBook } from "@/shared/types";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Home() {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const totalCount = useRef<number>(0);

  const [data, setData] = useState<IBook[]>();
  const [paging, setpaging] = useState<number>(1);

  const fetchData = useCallback(async () => {
    const result = JSON.parse(localStorage.getItem("bookmark") as string);
    if (!result) return;

    const data = result.map((v: IBook) => ({
      ...v,
      active: false,
      bookmark: true,
    }));
    totalCount.current = data.length;
    setData(data.slice(0, 10 * paging));
  }, [paging]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (paging === 1) return;

    fetchData();
  }, [paging]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setpaging((prev) => prev + 1);
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [loadMoreRef.current]);

  return (
    <>
      <h1 className="text-[22px] font-bold">내가 찜한 책</h1>
      <BookMarkList
        data={data}
        setData={setData}
        totalCount={totalCount.current}
      />
      <div
        ref={loadMoreRef}
        className={`py-8 ${data && data?.length > 0 ? "block" : "hidden"}`}
      ></div>
    </>
  );
}
