export interface IBook {
  authors: string[];
  contents: string;
  datetime: string;
  isbn: string;
  price: number;
  publisher: string;
  sale_price: number;
  status: string;
  thumbnail: string;
  title: string;
  translators: string[];
  url: string;
  active?: boolean;
  bookmark?: false;
}

export interface IBooksMeta {
  is_end: boolean;
  pageable_count: number;
  total_count: number;
}

export interface IBooksData {
  documents?: IBook[];
  meta?: IBooksMeta;
}
