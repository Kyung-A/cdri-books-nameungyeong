"use client";
import { useClickOutside } from "@/shared/hooks";
import Image from "next/image";
import { Dispatch, SetStateAction, useRef } from "react";

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  keywords: string[];
  onRemove: (target: string) => void;
  isOpenAutoComplete: boolean;
  setOpenAutoComplete: Dispatch<SetStateAction<boolean>>;
}

export default function Search({
  keywords,
  onRemove,
  isOpenAutoComplete,
  setOpenAutoComplete,
  ...props
}: IInputProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useClickOutside(
    contentRef,
    triggerRef,
    isOpenAutoComplete,
    setOpenAutoComplete
  );

  return (
    <div
      className={`bg-[#F2F4F6] w-full ${
        isOpenAutoComplete ? "rounded-3xl" : "rounded-full"
      }`}
    >
      <div ref={triggerRef} className="flex items-center p-[10px]">
        <Image width={30} height={30} src="/search.png" alt="search" />
        <input
          type="search"
          className="ml-1.5 w-full placeholder:text-[#8D94A0] outline-black"
          onFocus={() => setOpenAutoComplete(true)}
          {...props}
        />
      </div>

      {isOpenAutoComplete && keywords.length > 0 && (
        <div ref={contentRef} className="w-full pl-12 pb-7 pr-6 pt-3">
          <ul className="flex flex-col gap-y-4">
            {keywords.map((keyword, idx) => (
              <li
                key={`${keyword}-${idx}`}
                className="flex items-center justify-between"
              >
                <span className="text-[#8D94A0]">{keyword}</span>
                <button
                  type="button"
                  onClick={() => onRemove(keyword)}
                  className="cursor-pointer"
                >
                  <Image width={24} height={24} src="/close.png" alt="delete" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
