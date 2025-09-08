import { createContext, useReducer, type Dispatch as Dispatcher } from "react";
import { CtxReductions } from "@/Reductions/Context";
import type {
  CtxDispatch,
  CtxProviderProps as Props,
  Context as Type,
} from "@/Types";

const defaultCtx: Type = { user: null };

const AppStateContext = createContext<Type>(defaultCtx);
const AppDispatchContext = createContext<Dispatcher<CtxDispatch> | undefined>(
  undefined
);

export default function ChatCtxProvider(props: Props) {
  const [state, dispatch] = useReducer(CtxReductions, { ...defaultCtx });
  return (
    <AppStateContext.Provider value={{ ...state }}>
      <AppDispatchContext.Provider value={dispatch}>
        {props.children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}
