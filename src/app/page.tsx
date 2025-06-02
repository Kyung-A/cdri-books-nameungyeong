"use client";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, PopoverLayout, Search, Selectbox } from "@/shared/ui";
import { filterOptions } from "@/shared/consts";
import { useBooks } from "@/features/books/queries";
import { BookList } from "@/features/books/ui";
import { IBook, ISearchFilter } from "@/shared/types";
import { useInfiniteScroll, usePopoverContext } from "@/shared/hooks";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { setOpen } = usePopoverContext();

  const [searchInput, setSearchInput] = useState<string>("");
  const [detailFilters, setDetailFilters] = useState({ target: "", query: "" });
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isOpenAutoComplete, setOpenAutoComplete] = useState<boolean>(false);
  const [filters, setFilter] = useState<ISearchFilter>();

  const { data, fetchNextPage } = useBooks(filters);
  const allData = useMemo(
    () => (data ? data.pages.flatMap((page) => page.documents) : []),
    [data]
  );
  const totalCount = useMemo(
    () => data?.pages[0].meta?.total_count,
    [data?.pages]
  );

  const getSearchKeyword = useCallback(() => {
    return localStorage.getItem("keyword");
  }, []);

  const saveSearchKeyword = useCallback(
    (keyword: string) => {
      const keywords = JSON.parse(getSearchKeyword() as string) || [];
      if (keywords.length >= 8) {
        keywords.pop();
      }
      const set = new Set([keyword, ...keywords]);
      const result = [...set];
      localStorage.setItem("keyword", JSON.stringify(result));
    },
    [getSearchKeyword]
  );

  const handleSearch = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      setOpenAutoComplete(false);
      saveSearchKeyword(searchInput);
      setKeywords((prev) => {
        const set = new Set([searchInput, ...prev]);
        const result = [...set];

        if (result.length >= 8) {
          result.pop();
        }
        return result;
      });

      setDetailFilters({ target: "", query: "" });
      setFilter({ query: searchInput });
    },
    [saveSearchKeyword, searchInput]
  );

  const handleDetailSearch = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      setSearchInput("");
      setFilter(detailFilters);
      setOpen(false);
    },
    [detailFilters, setOpen]
  );

  const removeSearchKeyword = useCallback(
    (target: string) => {
      const keywords = JSON.parse(getSearchKeyword() as string) || [];
      const newValue = keywords.filter((v: string) => v !== target);
      localStorage.setItem("keyword", JSON.stringify(newValue));
      setKeywords(newValue);
    },
    [getSearchKeyword]
  );

  const handleSearchFilter = useCallback((value: string) => {
    setDetailFilters((prev) => ({ ...prev, target: value }));
  }, []);

  useEffect(() => {
    const keywords = JSON.parse(getSearchKeyword() as string) || [];
    if (!keywords) return;
    setKeywords(keywords);
  }, [getSearchKeyword]);

  useInfiniteScroll(loadMoreRef, fetchNextPage);

  return (
    <>
      <h1 className="text-[22px] font-bold">도서 검색</h1>

      <div className="flex gap-x-4 mt-4">
        <form className="w-[480px]" onSubmit={handleSearch}>
          <Search
            placeholder="검색어를 입력하세요."
            value={searchInput}
            onCustomChange={(e) => {
              setSearchInput(e);
            }}
            onRemove={removeSearchKeyword}
            keywords={keywords}
            isOpenAutoComplete={isOpenAutoComplete}
            setOpenAutoComplete={setOpenAutoComplete}
            ref={inputRef}
          />
        </form>
        <PopoverLayout.Root>
          <PopoverLayout.Trigger
            className="border mt-2 border-[#8D94A0] text-[#8D94A0] py-[5px] px-[10px] rounded-md font-medium text-sm flex "
            type="button"
          >
            상세검색
          </PopoverLayout.Trigger>
          <PopoverLayout.Content>
            <form onSubmit={handleDetailSearch}>
              <div className="flex gap-x-1 mt-2">
                <Selectbox
                  value={detailFilters.target}
                  onChange={handleSearchFilter}
                  options={filterOptions}
                  className="w-[100px]"
                />
                <input
                  type="search"
                  className="border-b border-[#4880EE] outline-black w-[208px] p-2 text-sm placeholder:text-[#8D94A0]"
                  placeholder="검색어 입력"
                  value={detailFilters.query}
                  onChange={(e) =>
                    setDetailFilters((prev) => ({
                      ...prev,
                      query: e.target.value,
                    }))
                  }
                />
              </div>
              <Button
                type="submit"
                styleType="primary"
                label="검색하기"
                className="w-full mt-4 !py-[7px] !text-sm !font-medium"
              />
            </form>
          </PopoverLayout.Content>
        </PopoverLayout.Root>
      </div>
      <BookList
        data={allData as IBook[]}
        totalCount={totalCount}
        filters={filters}
      />
      <div
        ref={loadMoreRef}
        className={`py-8 ${
          allData && allData?.length > 0 ? "block" : "hidden"
        }`}
      ></div>
    </>
  );
}
