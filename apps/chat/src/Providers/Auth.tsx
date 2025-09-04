import { createContext, useReducer } from "react";
import { AuthReductions } from "@Reductions/Auth";
import type { AuthProviderProps as Props, Auth } from "@/Types";

const defaultAuth = {
  isLoggedIn: false,
  user: null,
  ttl: "",
};

const Context = createContext<Auth>(defaultAuth);

export default function AuthProvider(props: Props) {
  const [state, dispatch] = useReducer(AuthReductions, { ...defaultAuth });
  return <Context.Provider value={state}>{props.children}</Context.Provider>;
}
