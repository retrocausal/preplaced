import type { LazyFetchState, LazyFetchAction } from "@/Types";

export const lazyFetchReductions = (
  state: LazyFetchState,
  action: LazyFetchAction
): LazyFetchState => {
  const cloned = { ...state };
  let messages: LazyFetchState["messages"] = null;
  let existingMessages = cloned.messages ?? [];
  const { type, value } = action;
  switch (type) {
    case "COMPLETE":
      messages = value?.messages ?? [];
      cloned.messages = [...messages, ...existingMessages];
      cloned.page = value?.page ?? cloned.page;
      break;
    case "SETCONTEXT":
      cloned.id = value?.id ?? cloned.id;
      cloned.messages = value?.messages ?? null;
      break;
    default:
  }
  return cloned;
};
