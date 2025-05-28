"use client";
import { Header, PopoverLayout, Search } from "@/shared/ui";

export default function Home() {
  return (
    <div className="w-full">
      <Header />
      <main className="max-w-[960px] w-full mx-auto pt-20">
        <h1 className="text-[22px] font-bold">도서 검색</h1>

        <div className="flex items-center gap-x-4 mt-4">
          <div className="w-[480px]">
            <Search placeholder="검색어를 입력하세요." />
          </div>
          <PopoverLayout.Root>
            <PopoverLayout.Trigger
              className="border border-[#8D94A0] text-[#8D94A0] py-[5px] px-[10px] rounded-md font-medium text-sm"
              type="button"
            >
              상세검색
            </PopoverLayout.Trigger>
            <PopoverLayout.Content>
              <div></div>
            </PopoverLayout.Content>
          </PopoverLayout.Root>
        </div>
        <div className="mt-6 flex items-center gap-x-4">
          <p className="font-medium">도서 검색 결과</p>
          <p>
            총 <span className="text-blue-500">0</span>건
          </p>
        </div>
      </main>
    </div>
  );
}
