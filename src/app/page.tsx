"use client";
import { useCallback, useEffect, useState } from "react";
import { IBook, IBooksData } from "@/shared/types";
import { Button, Header, PopoverLayout, Search, Selectbox } from "@/shared/ui";
import axios from "axios";
import Image from "next/image";

export default function Home() {
  const [data, setData] = useState<IBooksData>();

  // TODO: 임시 작성
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

  const hanldeSearchFilter = useCallback((e) => {
    console.log(e);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

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
        <div className="mt-6 flex items-center gap-x-4">
          <p className="font-medium">도서 검색 결과</p>
          <p>
            총 <span className="text-blue-500">{data?.documents?.length}</span>
            건
          </p>
        </div>

        {data ? (
          <ul className="w-full mt-9">
            {data.documents?.map((book) => (
              <li
                key={book.isbn}
                className="flex items-center justify-between pl-12 pr-4 py-4 border-b border-[#D2D6DA] w-full"
              >
                {book.active ? (
                  <div className="w-full h-full flex py-6">
                    <div className="relative">
                      <div className="w-[210px] h-[280px]">
                        <Image src={book.thumbnail} fill alt="book thumbnail" />
                      </div>
                      <div className="absolute z-10 top-2 right-2">
                        <button type="button" className="cursor-pointer">
                          {book.bookmark ? (
                            <Image
                              src="/bookmark.png"
                              width={24}
                              height={24}
                              alt="bookmark"
                            />
                          ) : (
                            <Image
                              src="/unbookmark.png"
                              width={24}
                              height={24}
                              alt="unbookmark"
                            />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex w-full">
                      <div className="w-[360px] shrink-0 ml-8 mr-12">
                        <div className="flex items-center gap-x-4">
                          <p className="font-bold text-lg">{book.title}</p>
                          <p className="font-medium text-[#6D7582] text-sm">
                            {book.authors.join(", ")}
                          </p>
                        </div>
                        <p className="text-sm font-bold mt-4">책 소개</p>
                        <p className="mt-3 text-[10px] break-keep whitespace-pre-wrap">
                          {book.contents}
                        </p>
                      </div>
                      <div className="w-full flex flex-col items-end justify-between">
                        <Button
                          label={
                            <div className="flex items-center">
                              <span className="text-[#6D7582] mr-1">
                                상세보기
                              </span>
                              <Image
                                width={14}
                                height={8}
                                src="/chevron.png"
                                alt="chevron-icon"
                                className="shrink-0 rotate-180"
                              />
                            </div>
                          }
                          styleType="ghost"
                          className="px-5"
                          onClick={() => handleClickBookmark(book)}
                        />
                        <div className="w-full">
                          <p className="text-end">
                            <span className="text-[#8D94A0] font-medium text-[10px]">
                              원가
                            </span>
                            <span
                              className={`ml-2 font-light text-lg ${
                                book.sale_price ? "line-through" : ""
                              }`}
                            >
                              {book.price.toLocaleString("ko-KR")}원
                            </span>
                          </p>
                          {book.sale_price && (
                            <p className="text-end">
                              <span className="text-[#8D94A0] font-medium text-[10px]">
                                할인가
                              </span>
                              <span className="font-bold text-lg ml-2">
                                {book.sale_price.toLocaleString("ko-KR")}원
                              </span>
                            </p>
                          )}
                          <Button
                            label="구매하기"
                            styleType="primary"
                            className="w-full block mt-7 !py-3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <Image
                      src={book.thumbnail}
                      width={45}
                      height={68}
                      alt="book thumbnail"
                    />
                    <div className="flex items-center justify-start w-full max-w-[408px] gap-x-4">
                      <p className="font-bold text-lg">{book.title}</p>
                      <p className="font-medium text-[#6D7582] text-sm">
                        {book.authors.join(", ")}
                      </p>
                    </div>
                    <p className="font-bold text-lg">
                      {book.price.toLocaleString("ko-KR")}원
                    </p>
                    <div className="flex items-center gap-x-2">
                      <Button
                        label="구매하기"
                        styleType="primary"
                        className="px-7"
                      />
                      <Button
                        label={
                          <div className="flex items-center">
                            <span className="text-[#6D7582] mr-1">
                              상세보기
                            </span>
                            <Image
                              width={14}
                              height={8}
                              src="/chevron.png"
                              alt="chevron-icon"
                              className="shrink-0"
                            />
                          </div>
                        }
                        styleType="ghost"
                        className="px-5"
                        onClick={() => handleClickBookmark(book)}
                      />
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full pt-[120px]">
            <Image width={80} height={80} src="/book.png" alt="book-icon" />
            <p className="mt-6 font-medium text-[#6D7582]">
              검색된 결과가 없습니다.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
