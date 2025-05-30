"use client";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Button, PopoverLayout, Search, Selectbox } from "@/shared/ui";
import { BookList } from "@/features/books/ui";
import { IBook, IBooksData } from "@/shared/types";
import axios from "axios";
import { filterOptions } from "@/shared/consts";

interface IPaging {
  page: number;
  size: number;
}

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
  const [paging, setpaging] = useState<IPaging>({
    page: 1,
    size: 10,
  });
  const [data, setData] = useState<IBooksData>();
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isOpenAutoComplete, setOpenAutoComplete] = useState<boolean>(false);

  const fetchData = useCallback(async (search?: string) => {
    const {
      data: { documents, meta },
    } = await axios.get(
      `${process.env.NEXT_PUBLIC_KAKAO_API_ENDPOINT}search/book?${search}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_APP_KEY}`,
        },
      }
    );

    const data = documents.map((v: IBook) => ({
      ...v,
      active: false,
      bookmark: false,
    }));
    setData((prev) => ({
      documents: prev?.documents ? [...prev.documents, ...data] : data,
      meta,
    }));
  }, []);

  const getSearchKeyword = useCallback(() => {
    return localStorage.getItem("keyword") || [];
  }, []);

  const saveSearchKeyword = useCallback(
    (keyword: string) => {
      const keywords = JSON.parse(getSearchKeyword() as string);
      if (keywords.length >= 8) {
        keywords.pop();
      }
      const result = [keyword, ...keywords];
      localStorage.setItem("keyword", JSON.stringify(result));
    },
    [getSearchKeyword]
  );

  const changefilterString = useCallback(
    async (page?: IPaging) => {
      const detailFilter = {
        ...searchFilter,
        ...(page ? page : paging),
        query:
          searchFilter.target && searchFilter.targetQuery
            ? searchFilter.targetQuery
            : searchFilter.query,
      };

      const queryString = Object.entries(detailFilter)
        .filter(([key]) => key !== "targetQuery")
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      await fetchData(queryString);
    },
    [fetchData, searchFilter, paging]
  );

  const handleSearch = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setData({});
      setpaging({ page: 1, size: 10 });

      saveSearchKeyword(searchFilter.query);
      setKeywords((prev) => {
        if (prev.length >= 8) {
          prev.pop();
        }
        return [searchFilter.query, ...prev];
      });
      setOpenAutoComplete(false);
      setSerachFilter({
        query: searchFilter.query,
      });

      changefilterString({ page: 1, size: 10 });
    },
    [saveSearchKeyword, searchFilter.query, changefilterString]
  );

  const handleDetailSearch = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setData({});
      setpaging({ page: 1, size: 10 });

      changefilterString({ page: 1, size: 10 });
      setSerachFilter((prev) => ({
        ...prev,
        query: "",
        target: undefined,
      }));
    },
    [changefilterString]
  );

  const removeSearchKeyword = useCallback(
    (target: string) => {
      const keywords = JSON.parse(getSearchKeyword() as string);
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
    const keywords = JSON.parse(getSearchKeyword() as string);
    if (!keywords) return;
    setKeywords(keywords);
  }, [getSearchKeyword]);

  useEffect(() => {
    if (paging.page === 1) return;

    changefilterString();
  }, [paging.page]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setpaging((prev) => ({
            ...prev,
            page: prev.page + 1,
          }));
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [loadMoreRef.current]);

  return (
    <>
      <h1 className="text-[22px] font-bold">도서 검색</h1>

      <div className="flex gap-x-4 mt-4">
        <form className="w-[480px]" onSubmit={handleSearch}>
          <Search
            placeholder="검색어를 입력하세요."
            value={searchFilter.query}
            onChange={(e) =>
              setSerachFilter((prev) => ({ ...prev, query: e.target.value }))
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
      <BookList data={data?.documents} setData={setData} />
      <div
        ref={loadMoreRef}
        className={`py-8 ${
          data?.documents && data?.documents?.length > 0 ? "block" : "hidden"
        }`}
      ></div>
    </>
  );
}
