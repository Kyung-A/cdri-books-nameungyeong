import { Header, Search } from "@/shared/ui";

export default function Home() {
  return (
    <div className="w-full">
      <Header />
      <main className="w-[960px] mx-auto pt-20">
        <h1 className="text-[22px] font-bold">도서 검색</h1>

        <div className="flex items-center gap-x-4">
          <div className="w-[480px]">
            <Search placeholder="검색어를 입력하세요." />
          </div>
          <button
            className="border border-[#8D94A0] text-[#8D94A0] py-[5px] px-[10px] rounded-md font-medium text-sm"
            type="button"
          >
            상세검색
          </button>
        </div>
      </main>
    </div>
  );
}
