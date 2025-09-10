import type { Context, CtxDispatch } from "@/Types";

export const CtxReductions = (state: Context, action: CtxDispatch): Context => {
  const clonedContext = { ...state };

  switch (action?.type) {
    case "AUTHENTICATE":
      clonedContext.username =
        action?.value?.username ?? clonedContext.username;
      clonedContext.chatCount =
        action?.value?.chatCount ?? clonedContext.chatCount;
      clonedContext.displayName =
        action?.value?.displayName ?? clonedContext.displayName;
      break;
    case "UNAUTHENTICATE":
      clonedContext.username = null;
      clonedContext.chatCount = 0;
      clonedContext.displayName = null;
      break;
    case "CONVERSATION":
      clonedContext.conversation = action?.value?.conversation ?? null;
      break;
    default:
  }
  return clonedContext;
};
