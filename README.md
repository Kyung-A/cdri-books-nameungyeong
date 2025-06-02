# Certicos Books

> 책 검색 및 즐겨찾기

## 프로젝트 개요

사용자가 키워드 또는 상세 조건을 통해 도서를 검색할 수 있도록 구성된 Next.js + React Query 기반의 검색 서비스입니다.

## 실행 방법 및 환경 설정

<pre><code>$ npm install
$ npm run dev
</code></pre>

## 폴더 구조 및 주요 코드 설명

<pre><code>
src/
├── app/                
├── features/           # 기능 단위(도메인 단위) 모듈화
│   └── books/          # 도서 검색 관련
│       ├── apis/       # API 요청 모듈
│       ├── queries/    # React Query 데이터 요청 hook
│       └── ui/         # UI 컴포넌트
├── shared/             # 재사용 가능한 공통 로직
│   ├── ui/             # 공통 UI 컴포넌트
│   ├── hooks/          # custom hooks
│   ├── context/        # 전역 상태
│   ├── consts/         # 상수 정의
│   └── types.ts        # 전역 타입 정의
</code></pre>

## 라이브러리 선택 이유

- `axios` : JSON 자동 변환 및 쿼리 파라미터 params 옵션 제공, 오류 제어 등 개발자가 수동으로 설정할 필요 없이 실용적인 기능들을 제공하기 때문이다.

## 강조 하고 싶은 기능

- `무한 스크롤` : React-query + IntersectionObserver 기반 무한 스크롤 페이징 구현
- `FSD 구조 설계` : 공통, 기능별 디렉토리 분리로 관심사 분리 및 역할 분담, 재사용성 및 이식성 향상
