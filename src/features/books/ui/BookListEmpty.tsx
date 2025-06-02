import Image from "next/image";

export default function BookListEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-full pt-[120px]">
      <Image width={80} height={80} src="/book.png" alt="book-icon" />
      <p className="mt-6 font-medium text-secondary">검색된 결과가 없습니다.</p>
    </div>
  );
}
