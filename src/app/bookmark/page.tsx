"use client";
import { BookList } from "@/features/books/ui";

export default function Home() {
  return (
    <>
      <h1 className="text-[22px] font-bold">내가 찜한 책</h1>
      {/* <div className="mt-6 flex items-center gap-x-4">
        <p className="font-medium">찜한 책</p>
        <p>
          총 <span className="text-blue-500">{data?.documents?.length}</span>건
        </p>
      </div> */}

      <BookList />
    </>
  );
}
