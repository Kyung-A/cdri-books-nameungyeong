"use client";
import { useState } from "react";
import Image from "next/image";

export default function Search({
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const [isOpenAutoComplete, setOpenAutoComplete] = useState<boolean>(false);

  return (
    <div
      className={`bg-[#F2F4F6] w-full ${
        isOpenAutoComplete ? "rounded-3xl" : "rounded-full"
      }`}
    >
      <div className="flex items-center p-[10px]">
        <Image width={30} height={30} src="/search.png" alt="search" />
        <input
          type="search"
          className="ml-1.5 w-full placeholder:text-[#8D94A0] outline-black"
          onFocus={() => setOpenAutoComplete(true)}
          onBlur={() => setOpenAutoComplete(false)}
          {...props}
        />
      </div>

      {isOpenAutoComplete && (
        <div className="w-full pl-12 pb-7 pr-6 pt-3">
          <ul className="flex flex-col gap-y-4">
            <li className="flex items-center justify-between">
              <span className="text-[#8D94A0]">정보</span>
              <button type="button">
                <Image width={24} height={24} src="/close.png" alt="delete" />
              </button>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-[#8D94A0]">정보</span>
              <button type="button">
                <Image width={24} height={24} src="/close.png" alt="delete" />
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
