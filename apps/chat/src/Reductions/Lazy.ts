import type { LazyFetchState, LazyFetchAction } from "@/Types";

export const lazyFetchReductions = (
  state: LazyFetchState,
  action: LazyFetchAction
): LazyFetchState => {
  const cloned = { ...state };
  const { type, value } = action;
  console.log(type);

  switch (type) {
    case "SETCONTEXT":
      cloned.id = value?.id ?? cloned.id;
      cloned.messages = value?.messages ?? [];
      cloned.cursor = value?.cursor ?? null;
      break;
    case "SCROLLEND":
      cloned.resetObserver = true;
      break;
    case "COMPLETE":
      cloned.messages = [
        ...(value?.messages ?? []),
        ...(cloned.messages ?? []),
      ];
      cloned.cursor = value?.cursor ?? null;
      break;
    default:
  }
  return cloned;
};
