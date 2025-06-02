import { ISearchFilter } from "@/shared/types";
import axios from "axios";

interface ISearchFilterProps extends ISearchFilter {
  page: unknown;
  size: number;
}

export const getBooks = async (filters: ISearchFilterProps) => {
  try {
    const { data } = await axios.get(`/api/book`, {
      params: filters,
      headers: {
        Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_APP_KEY}`,
      },
    });

    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
