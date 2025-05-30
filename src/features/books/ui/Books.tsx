"use client";
import { Button } from "@/shared/ui";
import Image from "next/image";
import Link from "next/link";

export default function Books({ data, handleClickBookmark }) {
  return (
    <ul className="w-full mt-9">
      {data?.map((book) => (
        <li
          key={book.isbn}
          className="flex items-center justify-between pl-12 pr-4 py-4 border-b border-[#D2D6DA] w-full"
        >
          {book.active ? (
            <div className="w-full h-full flex py-6">
              <div className="relative">
                <div className="w-[210px] h-[280px]">
                  <Image
                    src={book.thumbnail}
                    width={210}
                    height={280}
                    alt="book thumbnail"
                    className="w-full h-full"
                  />
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
                        <span className="text-[#6D7582] mr-1">상세보기</span>
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
                    <Link
                      href={book.url}
                      target="_blank"
                      className="w-full block mt-7 !py-3 rounded-lg font-medium box-border border bg-[#4880EE] cursor-pointer text-white border-transparent"
                    >
                      구매하기
                    </Link>
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
                <Link
                  href={book.url}
                  target="_blank"
                  className="w-full block py-4 rounded-lg font-medium box-border px-7 border bg-[#4880EE] cursor-pointer text-white border-transparent"
                >
                  구매하기
                </Link>
                <Button
                  label={
                    <div className="flex items-center">
                      <span className="text-[#6D7582] mr-1">상세보기</span>
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
  );
}
