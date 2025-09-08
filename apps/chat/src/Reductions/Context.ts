import type { Context, CtxDispatch } from "@/Types";

export const CtxReductions = (state: Context, action: CtxDispatch): Context => {
  switch (action?.type) {
    case "value":
      break;

    default:
      break;
  }
  return state;
};
