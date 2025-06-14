"use client";
import { IBook } from "@/shared/types";
import { Button } from "@/shared/ui";
import Image from "next/image";
import Link from "next/link";

interface IBooksProps {
  data: IBook[];
  handleClickDetail: (book: IBook) => void;
  handleClickBookmark: (book: IBook) => void;
}

export default function Books({
  data,
  handleClickDetail,
  handleClickBookmark,
}: IBooksProps) {
  return (
    <ul className="w-full mt-9">
      {data?.map((book) => (
        <li
          key={book.url}
          className="flex items-center justify-between pl-12 pr-4 py-4 border-b border-[#D2D6DA] w-full"
        >
          {book.active ? (
            <div className="w-full h-full flex py-6">
              <div className="relative">
                <div className="w-[210px] h-[280px]">
                  {book.thumbnail !== "" ? (
                    <Image
                      src={book.thumbnail}
                      width={210}
                      height={280}
                      alt="book thumbnail"
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100"></div>
                  )}
                </div>
                <div className="absolute z-10 top-2 right-2">
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => handleClickBookmark(book)}
                  >
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
                    <p className="font-medium text-secondary text-sm">
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
                        <span className="text-secondary mr-1">상세보기</span>
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
                    onClick={() => handleClickDetail(book)}
                  />
                  <div className="w-full">
                    <p className="text-end">
                      <span className="text-subtitle font-medium text-[10px]">
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
                        <span className="text-subtitle font-medium text-[10px]">
                          할인가
                        </span>
                        <span className="font-bold text-lg ml-2">
                          {book.sale_price.toLocaleString("ko-KR")}원
                        </span>
                      </p>
                    )}
                    <Link
                      href={book.url}
                      target="_blank"
                      className="w-full block mt-7 !py-3 rounded-lg font-medium box-border border bg-palette-primary cursor-pointer text-white border-transparent text-center"
                    >
                      구매하기
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="w-[45px] h-[68px]">
                {book.thumbnail !== "" ? (
                  <Image
                    src={book.thumbnail}
                    width={45}
                    height={68}
                    alt="book thumbnail"
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100"></div>
                )}
              </div>
              <div className="flex items-center justify-start w-full max-w-[408px] gap-x-4">
                <p className="font-bold text-lg">{book.title}</p>
                <p className="font-medium text-secondary text-sm">
                  {book.authors.join(", ")}
                </p>
              </div>
              <p className="font-bold text-lg">
                {book.price.toLocaleString("ko-KR")}원
              </p>
              <div className="flex items-center gap-x-2">
                <Link
                  href={book.url}
                  target="_blank"
                  className="w-full block py-4 rounded-lg font-medium box-border px-7 border bg-palette-primary cursor-pointer text-white border-transparent"
                >
                  구매하기
                </Link>
                <Button
                  label={
                    <div className="flex items-center">
                      <span className="text-secondary mr-1">상세보기</span>
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
                  onClick={() => handleClickDetail(book)}
                />
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
