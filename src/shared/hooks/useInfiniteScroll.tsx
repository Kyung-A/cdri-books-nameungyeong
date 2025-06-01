"use client";
import { RefObject, useEffect } from "react";

export default function useInfiniteScroll(
  ref: RefObject<HTMLDivElement | null>,
  Fn: () => void
) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          Fn();
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [Fn, ref]);
}
