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

function getCursor(msgs: LazyFetchState["messages"]): number | null {
  if (msgs && msgs.length > 0) {
    const ts = msgs[0].epoch?.timestamp;
    return typeof ts === "number" ? ts : null;
  }
  return null;
}

export default function useFetchChats(id: string = "", msgSet: string = "[]") {
  const [state, dispatch] = useReducer(lazyFetchReductions, {
    id: "",
    messages: null,
    cursor: null,
    resetObserver: false,
  });

  const { id: conversationId, cursor, resetObserver } = state;
  const target = useRef<HTMLLIElement | null>(null);
  const ancestor = useRef<HTMLDivElement | null>(null);
  const sBottom = useRef<HTMLLIElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const prevScrollht = useRef(0);
  const src = `${PATHS.CONVERSATION}`;
  const REFS = { target, ancestor, sBottom };
  const { fetch, inProgress } = useApiService(src, "GET");

  const fetchMore = useCallback(async () => {
    try {
      if (ancestor.current)
        prevScrollht.current = ancestor.current.scrollHeight;
      if (cursor !== null && conversationId) {
        const query: Record<string, string> = {
          id: conversationId,
          cursor: `${cursor}`,
        };
        const response = await fetch({ query });
        const { data } = response;
        if (data) {
          const { conversations } = data as JsonObject as {
            conversations: LazyFetchState["messages"];
          };
          dispatch({
            type: "COMPLETE",
            value: {
              messages: conversations,
              cursor: getCursor(conversations),
            },
          });
        }
      }
    } catch (error) {}
  }, [fetch, dispatch, conversationId, cursor]);

  const observe = useCallback(() => {
    if (ancestor.current && target.current) {
      observerRef.current?.disconnect();
      const root = ancestor.current;
      const observable = target.current;
      observerRef.current = ThrottledObserver.create(fetchMore, root);
      observerRef.current.observe(observable);
    }
  }, [observerRef, target, ancestor, fetchMore]);

  useEffect(() => {
    if (id && msgSet) {
      const conversations: LazyFetchState["messages"] = JSON.parse(msgSet);
      const cursor = getCursor(conversations);
      dispatch({
        type: "SETCONTEXT",
        value: {
          id,
          messages: conversations,
          cursor,
        },
      });
    }
  }, [id, dispatch, msgSet]);

  useEffect(() => {
    let cb: null | (() => void) = () => {
      dispatch({ type: "SCROLLEND" });
    };
    if (conversationId && sBottom.current && ancestor.current && cb) {
      ancestor.current.addEventListener("scrollend", cb, { once: true });
      sBottom.current.scrollIntoView({ behavior: "smooth" });
    }
    return () => {
      if (cb) {
        ancestor.current?.removeEventListener("scrollend", cb);
        cb = null;
      }
    };
  }, [sBottom, conversationId, ancestor, dispatch]);

  useEffect(() => {
    if (resetObserver) {
      observe();
    }
  }, [resetObserver, observe]);

  useLayoutEffect(() => {
    if (ancestor.current && cursor && prevScrollht.current > 0) {
      const { scrollHeight } = ancestor.current;
      // Adjust scroll position to maintain view after loading more messages
      const heightDiff = scrollHeight - prevScrollht.current;
      if (heightDiff > 0) {
        ancestor.current.scrollTop += heightDiff;
      }
      prevScrollht.current = scrollHeight;
    }
  }, [cursor, ancestor, prevScrollht]);

  return { REFS, inProgress, ...state, dispatch };
}

class ThrottledObserver {
  static options = {
    root: null as Element | null, // Will set dynamically
    rootMargin: "0px 0px 0px 0px",
    threshold: [0.5, 0.75, 0.9],
  };
  static create = (
    callback: () => void,
    root: Element | null = null,
    delay: number = 500,
    triggerRatio: number = 0.5
  ): IntersectionObserver => {
    let then = 0;
    const throttled = () => {
      return function (entries: IntersectionObserverEntry[]) {
        const now = Date.now();
        const intersections = entries.filter(
          (e) => e.isIntersecting && e.intersectionRatio > triggerRatio
        );
        if (now - then > delay && intersections.length > 0) {
          callback();
          then = Date.now();
        }
      };
    };
    return new IntersectionObserver(throttled(), { ...this.options, root });
  };
}

/**
 * 
 * 

 */
