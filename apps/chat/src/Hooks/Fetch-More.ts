import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
} from "react";
import { lazyFetchReductions } from "@/Reductions/Lazy";
import useApiService from "@/Core/hooks/Api";
import PATHS from "@/API";
import type { JsonObject, LazyFetchState } from "@/Types";

const options = {
  root: null as Element | null, // Will set dynamically
  rootMargin: "0px 0px 0px 0px",
  threshold: [0.5, 0.75, 0.9],
};
const createThrottledObserver = (
  callback: (page: number) => void,
  root: Element | null
): IntersectionObserver => {
  let then = 0;
  const throttled = () => {
    let page = 2;
    return function (entries: IntersectionObserverEntry[]) {
      const now = Date.now();
      const intersections = entries.filter(
        (e) => e.isIntersecting && e.intersectionRatio > 0.5
      );
      if (now - then > 480 && intersections.length > 0) {
        callback(page++);
        then = Date.now();
      }
    };
  };
  return new IntersectionObserver(throttled(), { ...options, root });
};

export default function useFetchChats(
  id: string = "",
  texts: LazyFetchState["messages"] = null
) {
  const [state, dispatch] = useReducer(lazyFetchReductions, {
    id: "",
    messages: null,
    page: 0,
  });

  const msgSet = JSON.stringify(texts);
  const { id: conversationId, messages, page } = state;
  const target = useRef<HTMLLIElement | null>(null);
  const ancestor = useRef<HTMLDivElement | null>(null);
  const sBottom = useRef<HTMLLIElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const prevScrollht = useRef(0);
  const src = `${PATHS.CONVERSATION}`;
  const { fetch, inProgress } = useApiService(src, "GET");

  const fetchMore = useCallback(
    async (page: number = 1) => {
      try {
        if (ancestor.current)
          prevScrollht.current = ancestor.current.scrollHeight;
        const response = await fetch({
          query: { id: conversationId, page: `${page}` },
        });
        const { data } = response;
        if (data) {
          const { conversations } = data as JsonObject as {
            conversations: LazyFetchState["messages"];
          };
          dispatch({
            type: "COMPLETE",
            value: { messages: conversations, page },
          });
        }
      } catch (error) {}
    },
    [fetch, dispatch, conversationId]
  );

  const observer = useCallback(() => {
    if (!ancestor.current || !target.current) {
      return;
    }
    const root = ancestor.current;
    const observable = target.current;
    const scrollObserver = createThrottledObserver(
      (page: number) => fetchMore(page),
      root
    );
    observerRef.current = scrollObserver;
    observerRef.current.observe(observable);
  }, [observerRef, target, ancestor, fetchMore]);

  useEffect(() => {
    observerRef.current?.disconnect();
    if (id && id !== conversationId) {
      dispatch({
        type: "SETCONTEXT",
        value: { id, messages: JSON.parse(msgSet) },
      });
    }
  }, [id, conversationId, dispatch, msgSet]);

  useLayoutEffect(() => {
    if (ancestor.current && page > 0 && prevScrollht.current > 0) {
      const { scrollHeight } = ancestor.current;
      // Adjust scroll position to maintain view after loading more messages
      const heightDiff = scrollHeight - prevScrollht.current;
      if (heightDiff > 0) {
        ancestor.current.scrollTop += heightDiff;
      }
      prevScrollht.current = scrollHeight;
    }
  }, [page, ancestor, prevScrollht]);

  return { target, ancestor, sBottom, observer, inProgress, messages };
}
