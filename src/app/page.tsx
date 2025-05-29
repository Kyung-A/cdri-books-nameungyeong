"use client";
import { useCallback } from "react";
import { Button, PopoverLayout, Search, Selectbox } from "@/shared/ui";
import { BookList } from "@/features/books/ui";

export default function Home() {
  const hanldeSearchFilter = useCallback((e) => {
    console.log(e);
  }, []);

  return (
    <>
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
            <div className="flex gap-x-1 mt-2">
              <Selectbox
                value=""
                onChange={hanldeSearchFilter}
                options={[
                  {
                    label: "저자명",
                    value: "저자명",
                  },
                  {
                    label: "출판사",
                    value: "출판사",
                  },
                ]}
                placeholder="제목"
                className="w-[100px]"
              ></Selectbox>
              <input
                type="search"
                className="border-b border-[#4880EE] outline-black w-[208px] p-2 text-sm placeholder:text-[#8D94A0]"
                placeholder="검색어 입력"
              />
            </div>
            <Button
              styleType="primary"
              label="검색하기"
              className="w-full mt-4 !py-[7px] !text-sm !font-medium"
            />
          </PopoverLayout.Content>
        </PopoverLayout.Root>
      </div>
      {/* <div className="mt-6 flex items-center gap-x-4">
        <p className="font-medium">도서 검색 결과</p>
        <p>
          총 <span className="text-blue-500">{data?.documents?.length}</span>건
        </p>
      </div> */}

      <BookList />
    </>
  );
}
