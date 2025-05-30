"use client";
import { BookList } from "@/features/books/ui";
import { IBook, IBooksData } from "@/shared/types";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Home() {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<IBooksData>();
  const [paging, setpaging] = useState<number>(1);

  const fetchData = useCallback(async () => {
    const result = JSON.parse(localStorage.getItem("bookmark") as string);

    const data = result.map((v: IBook) => ({
      ...v,
      active: false,
      bookmark: true,
    }));

    setData({
      documents: data.slice(0, 10 * paging),
      meta: {
        is_end: false,
        pageable_count: 0,
        total_count: 0,
      },
    });
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
      <BookList data={data?.documents} setData={setData} />
      <div
        ref={loadMoreRef}
        className={`py-8 ${
          data?.documents && data?.documents?.length > 0 ? "block" : "hidden"
        }`}
      ></div>
    </>
  );
}
