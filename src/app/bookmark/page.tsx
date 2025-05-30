"use client";
import { BookList } from "@/features/books/ui";
import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname();

  return (
    <>
      <h1 className="text-[22px] font-bold">내가 찜한 책</h1>
      {/* <BookList pathname={pathname} /> */}
    </>
  );
}
