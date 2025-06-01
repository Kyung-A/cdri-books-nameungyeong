import axios from "axios";

export const getBooks = async (filters: string) => {
  try {
    const { data } = await axios.get(`/api/book?${filters}`, {
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
