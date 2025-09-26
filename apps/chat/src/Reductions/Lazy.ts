import type { LazyFetchState, LazyFetchAction } from "@/Types";

export const lazyFetchReductions = (
  state: LazyFetchState,
  action: LazyFetchAction
): LazyFetchState => {
  const cloned = { ...state };

  const { type, value } = action;
  console.log(value);

  switch (type) {
    case "COMPLETE":
      break;
    case "SETCONTEXT":
      cloned.id = value?.id ?? cloned.id;
      break;
    default:
  }
  return cloned;
};
