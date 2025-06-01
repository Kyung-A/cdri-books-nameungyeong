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
import { IBook } from "@/shared/types";

interface ISearchFilter {
  query: string;
  target?: string;
  targetQuery?: string;
}

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [searchFilter, setSerachFilter] = useState<ISearchFilter>({
    query: "",
  });

  const [keywords, setKeywords] = useState<string[]>([]);
  const [isOpenAutoComplete, setOpenAutoComplete] = useState<boolean>(false);
  const [filters, setFilter] = useState<string>("");

  const { data, fetchNextPage } = useBooks(filters);
  const allData = useMemo(
    () => (data ? data.pages.flatMap((page) => page.documents) : []),
    [data]
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

      setSerachFilter({
        query: searchFilter.query,
      });
      setOpenAutoComplete(false);
      saveSearchKeyword(searchFilter.query);
      setKeywords((prev) => {
        const set = new Set([searchFilter.query, ...prev]);
        const result = [...set];

        if (result.length >= 8) {
          result.pop();
        }
        return result;
      });

      const detailFilter = {
        query: searchFilter.query,
      };

      const queryString = Object.entries(detailFilter)
        .filter(([key]) => key !== "targetQuery")
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      setFilter(queryString);
    },
    [saveSearchKeyword, searchFilter]
  );

  const handleDetailSearch = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      setSerachFilter((prev) => ({
        ...prev,
        query: "",
      }));

      const detailFilter = {
        ...searchFilter,
        query: searchFilter.targetQuery,
      };

      const queryString = Object.entries(detailFilter)
        .filter(([key]) => key !== "targetQuery")
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      setFilter(queryString);
    },
    [searchFilter]
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
    setSerachFilter((prev) => ({ ...prev, query: "", target: value }));
  }, []);

  useEffect(() => {
    const keywords = JSON.parse(getSearchKeyword() as string) || [];
    if (!keywords) return;
    setKeywords(keywords);
  }, [getSearchKeyword]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage]);

  return (
    <>
      <h1 className="text-[22px] font-bold">도서 검색</h1>

      <div className="flex gap-x-4 mt-4">
        <form className="w-[480px]" onSubmit={handleSearch}>
          <Search
            placeholder="검색어를 입력하세요."
            value={searchFilter.query}
            onCustomChange={(e) =>
              setSerachFilter((prev) => ({ ...prev, query: e }))
            }
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
                  value={searchFilter.target}
                  onChange={handleSearchFilter}
                  options={filterOptions}
                  className="w-[100px]"
                />
                <input
                  type="search"
                  className="border-b border-[#4880EE] outline-black w-[208px] p-2 text-sm placeholder:text-[#8D94A0]"
                  placeholder="검색어 입력"
                  value={searchFilter.targetQuery || ""}
                  onChange={(e) =>
                    setSerachFilter((prev) => ({
                      ...prev,
                      targetQuery: e.target.value,
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
      <BookList data={allData as IBook[]} filters={filters} />
      <div
        ref={loadMoreRef}
        className={`py-8 ${
          allData && allData?.length > 0 ? "block" : "hidden"
        }`}
      ></div>
    </>
  );
}
