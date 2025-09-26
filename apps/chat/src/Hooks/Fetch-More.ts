import { useCallback, useEffect, useReducer, useRef } from "react";
import { lazyFetchReductions } from "@/Reductions/Lazy";
import useApiService from "@/Core/hooks/Api";
import PATHS from "@/API";

const options = {
  root: null as Element | null, // Will set dynamically
  rootMargin: "0px 0px 90% 0px",
  threshold: [0.5, 0.75, 0.9],
};
const createThrottledObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  root: Element | null
): IntersectionObserver => {
  let then = 0;
  const throttled = () => {
    return function (entries: IntersectionObserverEntry[]) {
      const now = Date.now();
      if (now - then > 480) {
        callback(entries);
        then = Date.now();
      }
    };
  };
  return new IntersectionObserver(throttled(), { ...options, root });
};

export default function useFetchChats(id: string) {
  const [state, dispatch] = useReducer(lazyFetchReductions, {
    id,
    messages: [],
  });
  const { id: conversation } = state;
  const target = useRef<HTMLUListElement | null>(null);
  const ancestor = useRef<HTMLDivElement | null>(null);
  const sTop = useRef<HTMLLIElement | null>(null);
  const sBottom = useRef<HTMLLIElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const src = `${PATHS.CONVERSATION}?id=${id}`;
  const { fetch, inProgress } = useApiService(src, "GET");

  const fetchMore = useCallback(async () => {
    try {
      const response = await fetch();
      const { data } = response;
      if (data) {
        dispatch({ type: "COMPLETE", value: data });
      }
    } catch (error) {}
  }, [fetch, conversation, dispatch]);

  const observer = useCallback(() => {
    if (!ancestor.current || !target.current) {
      return;
    }
    const root = ancestor.current;
    const currentTarget = target.current;
    const scrollObserver = createThrottledObserver(
      (entries: IntersectionObserverEntry[]) => {
        const intersections = entries.filter(
          (e) => e.isIntersecting && e.intersectionRatio >= 0.75
        );
        if (intersections.length > 0 && typeof fetchMore === "function") {
          fetchMore();
        }
      },
      root
    );
    observerRef.current?.disconnect();
    observerRef.current = scrollObserver;
    observerRef.current.observe(currentTarget);
  }, [observerRef, target, ancestor, fetchMore]);

  useEffect(() => {
    dispatch({ type: "SETCONTEXT", value: { id } });
  }, [id, dispatch]);

  return { target, ancestor, sTop, sBottom, observer, inProgress };
}
