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

    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      setOpenAutoComplete(true);
      if (e.key === "ArrowDown") {
        setHighlightedIndex((prev) => {
          const nextIndex = prev < keywords.length - 1 ? prev + 1 : prev;
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
        setHighlightedIndex(-1);
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
        className={`bg-palette-lightGray w-full ${
          isOpenAutoComplete ? "rounded-3xl" : "rounded-full"
        }`}
      >
        <div ref={triggerRef} className="flex items-center p-[10px]">
          <Image width={30} height={30} src="/search.png" alt="search" />
          <input
            ref={ref}
            type="search"
            className="ml-1.5 w-full placeholder:text-subtitle outline-none"
            onClick={() => setOpenAutoComplete(true)}
            onFocus={() => setOpenAutoComplete(true)}
            onChange={(e) => {
              onCustomChange(e.target.value);
            }}
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
                  onMouseEnter={() => setHighlightedIndex(idx)}
                >
                  <button
                    type="button"
                    className={`block w-full text-left ${
                      idx === highlightedIndex
                        ? "text-blue-500 font-semibold"
                        : "text-subtitle"
                    }`}
                  >
                    {keyword}
                  </button>
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
