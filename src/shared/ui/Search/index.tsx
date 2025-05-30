// src/shared/ui/Search.tsx
"use client";

import React, {
  forwardRef,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import Image from "next/image";
import { useClickOutside } from "@/shared/hooks";

export interface ISearchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  keywords: string[];
  onRemove: (target: string) => void;
  onCustomChange: (value: string) => void;
  isOpenAutoComplete: boolean;
  setOpenAutoComplete: Dispatch<SetStateAction<boolean>>;
}

const Search = forwardRef<HTMLInputElement, ISearchProps>(
  (
    {
      keywords,
      onRemove,
      onCustomChange,
      isOpenAutoComplete,
      setOpenAutoComplete,
      ...props
    },
    ref
  ) => {
    const triggerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown") {
        setHighlightedIndex((prev) => {
          const nextIndex = prev < keywords.length - 1 ? prev + 1 : prev;

          if (optionRefs.current[nextIndex]) {
            optionRefs.current[nextIndex]?.scrollIntoView({
              block: "nearest",
              behavior: "smooth",
            });
          }
          return nextIndex;
        });
      } else if (e.key === "ArrowUp") {
        setHighlightedIndex((prev) => {
          const nextIndex = prev > 0 ? prev - 1 : 0;
          return nextIndex;
        });
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
        onCustomChange(keywords[highlightedIndex]);
        setOpenAutoComplete(false);
      }
    };

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
            ref={ref}
            type="search"
            className="ml-1.5 w-full placeholder:text-[#8D94A0] outline-none"
            onClick={() => setOpenAutoComplete(true)}
            onChange={(e) => onCustomChange(e.target.value)}
            onKeyDown={handleKeyDown}
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
                  onMouseDown={() => {
                    setOpenAutoComplete(false);
                  }}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                >
                  <span
                    className={`block w-full ${
                      idx === highlightedIndex
                        ? "text-blue-500 font-semibold hover:text-blue-500 hover:font-semibold"
                        : "text-[#8D94A0]"
                    }`}
                  >
                    {keyword}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemove(keyword)}
                    className="cursor-pointer"
                  >
                    <Image
                      width={24}
                      height={24}
                      src="/close.png"
                      alt="delete"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

Search.displayName = "Search";
export default Search;
