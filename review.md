# 프로젝트 구조

- npm
- tailwind
- next.js app router
- axios, @tanstack/react-query

# 기존 리뷰 분석

- 코드 구성과 구현이 팀의 방향과 다른 점이 있었다
- 컴포넌트 구조,
- 상태 관리,
- API 연동에서 완성도와 안정성 면에서 아쉬웠다

# 뜯어봅시다

## 페이지 구조

- /
- /bookmark

## 파일별 리뷰

## globals.css

### tailwind 사용

- theme사용은 좋습니다만, 너무 빈약합니다.
- 다른 파일에서 보니 className을 쓰는데 arbitrary values를 쓰는 곳도 상당히 많고,
- 다른 파일에서 tailwind를 사용할 때 className을 줄줄줄줄이 쓰는 경우가 많은데 이는 tailwind의 장점을 다 깎아먹는 일입니다.
- shadcn같은 구현체를 참고하시고, 유지보수를 고려한다면 theme을 충분히 활용하세요.
- smart component, dumb component를 분리하는 것을 고려하세요. (스타일링과 로직의 관심사 분리)
- 개인적으로 `유저가 보는 최종적인 결과물`에 해당하는 곳에서는 스타일링을 최소한으로 하는걸 권장합니다. `pages.tsx` 에서는 레고 조립하듯 해주세요.

## src/app/layout.tsx

### Provider 사용

- `QueryClientProvider`와 `PopoverProvider`를 사용하고 있습니다.

이 Provider들을 하나의 `providers.tsx` 같은 파일에 몰아다넣고 사용한다면, layout.tsx도 server component로 만들 수 있습니다.

혹여나 다른 Provider가 추가될 일이 있다면, `provider.tsx` 파일이 수정되지 `layout.tsx` 파일이 수정되므로 나중에 작업하는 사람은 **이 작업은 layout이 아닌 provider와 관련된 작업이구나** 하는걸 명확하게 알 수 있습니다.

- `<div className="w-full">`

div, 특히 layout에서의 div사용은 상당히 신중하게 하셔야합니다. 아무런 의미가 없는 wrapper는 아예 안쓰는게 더 나을수도 있습니다.

## src/app/page.tsx

### 시작부터 "use client"...?

- client component일 이유가 없는 페이지입니다.
- App router를 쓰신다면 기본적으로 server component 사용을 고려해보세요

### 상태관리

- useState로 상태를 관리하고 있습니다.
  예를들어 파일의 55-75 줄을 보면,

```typescript
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
```

이 함수에서 관심사를 뜯어보자면,

1. 자동완성 상태 업데이트: 끄기
2. 키워드 저장하기
3. 키워드 상태 업데이트: set을 또 만들고 많다싶으면 마지막에 들어간걸 가져온다(?)
4. detailFilters 상태 업데이트: 초기화
5. filter 상태 업데이트: 검색어로 초기화

너무 많습니다. 여기서부터 문제가 생깁니다. 이 내용들이, `정말로 크게 연관이 있어야만 한다면` 차라리 전부 같은 상태인건 어때요?

- localStorage 관리

사실 localStorage는 상태관리라고 보긴 힘들지만, browser에 굉장히 static한 형태로 상태를 저장하고싶어서 쓰기도 합니다.

아시다시피 localStorage에 데이터를 저장하고 인출해 오는 것은 늘상 하는 일이고, 또 react에서 여기에 저장된 데이터를 쓰고싶다면 매번 JSON.stringify와 JSON.parse를 해야합니다.

localStorage를 관리하는 custom hook을 만들어보시고, `localStorage`에 저장하고 불러오는 관심사를 확실히 분리해보세요.

react@19를 쓰고계시니 react@19의 `useSyncExternalStore`를 활용해보는 것도 좋습니다.

### `useMemo` 사용

29-36 라인에서,

```typescript
const allData = useMemo(
  () => (data ? data.pages.flatMap((page) => page.documents) : []),
  [data]
);
const totalCount = useMemo(
  () => data?.pages[0].meta?.total_count,
  [data?.pages]
);
```

이런 식으로 useMemo를 사용하는건 좋습니다. 단지 아쉬운건,

1. 다른데서도 `allData`, `totalCount` 정도는 필요하지 않을까요?
2. 의존성 배열을 보고, 배열 안에 있는 것들이 `딱히 다른걸 의존하지 않는데` 굳이 이 파일 안에서 memoizing을 해야 할 이유가 있을까요?
3. @tanstack/react-query에서 memoizing과 rerender방지를 위해 사용하는 `select`라는 것을 사용하시는게 우선 아닐까요?

https://tanstack.com/query/latest/docs/framework/react/guides/render-optimizations#select

이런 이유로, 그냥 `useBooks` 안에서 `allData`, `totalCount`를 반환해주는게 더 좋을 것 같습니다.

그런데 백엔드 입장에서 한번 생각해보신다면, 이 내용, books 이외에도 다른곳에서도 리턴해주고 있을 것 같습니다.

공통화도 가능하겠네요?

### useEffect 사용

```typescript
useEffect(() => {
  const keywords = JSON.parse(getSearchKeyword() as string) || [];
  if (!keywords) return;
  setKeywords(keywords);
}, [getSearchKeyword]);
```

- useEffect사용은 최대한 자제해주세요.
- 헷갈리시면, https://react.dev/learn/you-might-not-need-an-effect 정독해주세요.

### `useRef` 사용: inputRef

- `inputRef`는 왜 정의한건가요...? 쓰는 곳이 없는거같습니다.

### `useRef` 사용: loadMoreRef

`loadMoreRef`와 `fetchNextPage`가 서로 연관되는건 좋은 포인트입니다. 문제는, 둘이 엮이고 끝난다는점입니다. 이 파일의 다른 곳에서 이들이 같이 쓰이지 않습니다.

이건 꽤나 귀찮은 문제를 야기합니다.

1. `loadMoreRef`가 있기는 하지만 이건 이름에서도 알다시피 `더보기` 할 때 사용합니다. 그러면, `더보기`와 관련한곳에 있어야 맞습니다.
2. `더보기`를 하기 위해 `useInfiniteScroll`을 사용하고있습니다. 그러면, 해당 ref는 `useInfiniteScroll`이 갖고있는게 맞지 않을까요?
3. `fetchNextPage`는 이런식으로 주입되는게 맞아보입니다. 그런데, 이것이 필요한 부분은 `데이터가 필요할 때 infinite scroll할 지 말지` 정도가 아닐까 생각합니다.

그러면 `loadMoreRef`는 어떤 hook이 관리해야 맞는걸까요? 얘의 역할은 `어떤 DOM까지 왔을 때 trigger할 것인가` 입니다.

(이 파일이 수정된 기록을 볼 때, `유저가 보는 페이지가 수정` 되는것이 아니라 `어떤 특정한 기능이 수정` 될 것을 예상한다면 상당한 인지부하가 생깁니다. 위의 1~3에 비하면 사소한 문제입니다만, 이것도 고려해주세요.)

## src/app/bookmark/page.tsx

### `fetchData`

```typescript
const fetchData = useCallback(async () => {
  const localData = JSON.parse(localStorage.getItem("bookmark") as string);
  if (!localData) return;

  const result = localData.map((v: IBook) => ({
    ...v,
    active: false,
    bookmark: true,
  }));

  totalCount.current = result;
  setData(result.slice(0, 10));
}, []);
```

총체적 난국에 해당하는 코드입니다.

1. fetch하는것도 아니고,
2. 그렇다고 data를 잘 가져오는것도 아니고,
3. 그렇다고 타입안정성을 잘 보장하는 것도 아니고,
4. 상태의 update는 사실상 side effect에 해당합니다.

이건 아예 처음부터 다시 설계해보세요.

### infinite scroll할

56-59줄

```typescript react
<div
  ref={loadMoreRef}
  className={`py-8 ${data && data?.length > 0 ? "block" : "hidden"}`}
></div>
```

src/app/page.tsx와 동일한 문제입니다. 다시 생각해보세요.

## src/features/books/apis/getBooks.tsx

### 왜 tsx인가요?

- 이 파일에는 그냥 함수 하나정도만 있습니다. tsx일 필요가 없네요.

## src/features/books/queries/useBooks.tsx

- queryFn이 저렇게 될 이유가 있나요? queryFn이 가져와야 하는건 `the source of truth` 입니다.
- 에러를 반환할 가능성이 있다면 실제 `getBooks`를 할 때 이외에는 없어야합니다.
- 이런식으로 데이터 변형을 해야한다면 `select`를 사용해보세요

## src/features/books/ui/Books.tsx

- 개별 Book 컴포넌트를 감싸는 `<li />` 태그는 container로써 쓸 수도 있겠습니다.
- active에 해당하는 Book은 따로 빼주시고, 위에 언급한 container로 감싸주세요.
- inactive에 해당하는 Book도 따로 빼주시고, 위에 언급한 container로 감싸주세요.

## src/features/books/ui/BooksContainer.tsx

```typescript react
<div className="mt-6 flex items-center gap-x-4">
  <p className="font-medium">도서 검색 결과</p>
  <p>
    총 <span className="text-blue-500">{totalCount}</span>건
  </p>
</div>
```

- 요런 컴포넌트는 크게 똑똑한 컴포넌트가 아니면서도, 비즈니스적 요구사항(예: 다국어)에 따라 충분히 static하게 관리될 수 있어야합니다.

## shared

- 왜 shared...? 무엇과 공유하는건가요?

## src/shared/consts/filterOptions.ts, src/shared/consts/gnb.ts

- 굳이 파일로 분리할 이유가 있었나 싶습니다

## src/shared/context/PopoverProvider.tsx

- 이 내용은 좋아보입니다. Popover라는 관심사에 집중한 것도 좋네요.
- 아쉬운건 아예 `popover` 라는 feature에 집중하는건 어땠을까 하는 부분입니다. `popover/PopoverProvider.tsx`, `popover/usePopover.ts` `popover/useClickOutsidePopover.ts` `popover/Popover.tsx` 같은 식이 되겠네요.

## src/shared/context/QueryProvider.tsx

- `useState`는 rendering에 참여하는 상태값을 저장할 때 사용합니다.

https://tanstack.com/query/latest/docs/framework/react/examples/nextjs-app-prefetching?path=examples%2Freact%2Fnextjs-app-prefetching%2Fapp%2Fproviders.tsx
이 링크 참고해주세요

## src/shared/hooks/useInfiniteScroll.tsx

- useEffect를 안에 넣고 격리시킨건 좋아보입니다.
- 위에서 설명한 내용이 있으니 참고바랍니다

## src/shared/ui/Header/index.tsx

- 왜 index.tsx죠...? 다른데선 barrel 파일 형태를 쓰셨던데요
- 조건부 className을 쓰시려면 clsx같은걸 고려해보세요

## src/shared/ui/Search/index.tsx

- forwardRef는 deprecated되었습니다. https://react.dev/reference/react/forwardRef
- 다른 부분들도 너무 중복되는게 많아 생략합니다

## src/shared/ui/Button.tsx

- 아뇨... 이런 패턴 추천하지 않습니다. buttonStyle이 렌더링마다 재할당되겠네요

## src/shared/ui/PopoverLayout.tsx

- shadcn을 참고하신느낌이 나는데, 한번 여기서 구현한 내용들을 잘 차근차근 살펴보세요

## src/shared/ui/Selectbox.tsx

- 다른 곳에서 리뷰한 내용들과 중복되는게 많아 패스합니다.
