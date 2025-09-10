import {
  createContext,
  useEffect,
  useReducer,
  type Dispatch as Dispatcher,
} from "react";
import { CtxReductions } from "@/Reductions/Context";
import type {
  CtxDispatch,
  CtxProviderProps as Props,
  Context as Type,
} from "@/Types";
import { CryptoUtil } from "@/Utils/crypto";

const defaultCtx: Type = {
  username: null,
  displayName: null,
  chatCount: 0,
  conversation: null,
};

const AppStateContext = createContext<Type>(defaultCtx);
const AppDispatchContext = createContext<Dispatcher<CtxDispatch> | undefined>(
  undefined
);

export { AppDispatchContext, AppStateContext };

export default function ChatCtxProvider(props: Props) {
  const [state, dispatch] = useReducer(CtxReductions, { ...defaultCtx });
  const chatUser = localStorage.getItem(import.meta.env.VITE_APP_USER);
  useEffect(() => {
    if (chatUser) {
      CryptoUtil.decrypt(chatUser).then((user) => {
        const { username, displayName, chatCount } = user as unknown as Type;
        dispatch({
          type: "AUTHENTICATE",
          value: { username, displayName, chatCount },
        });
      });
    }
  }, [chatUser]);
  return (
    <AppStateContext.Provider value={{ ...state }}>
      <AppDispatchContext.Provider value={dispatch}>
        {props.children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}
