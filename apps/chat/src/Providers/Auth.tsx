import { createContext, useReducer } from "react";
import type { ReactNode } from "react";
import { AuthReductions } from "@Reductions/Auth";

interface Auth {
	isLoggedIn: boolean;
	user: string | null;
	ttl: string;
}

interface Props {
	children: ReactNode;
}

const defaultAuth = {
	isLoggedIn: false,
	user: null,
	ttl: "",
};

const Context = createContext<Auth>(defaultAuth);

export default function AuthProvider(props: Props) {
	const [state] = useReducer({ ...defaultAuth }, AuthReductions);
	return <Context.Provider value={state}>{props.children}</Context.Provider>;
}
