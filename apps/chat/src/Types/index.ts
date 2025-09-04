import type { ReactNode } from "react";
import type { HTMLFormMethod } from "react-router-dom";
export interface Auth {
  isLoggedIn: boolean;
  user: string | null;
  ttl: string;
}
export type AuthActionValue = {
  [K in keyof Auth]?: Auth[K];
};
export interface AuthAction {
  type: string;
  value?: AuthActionValue;
}

export interface AuthProviderProps {
  children: ReactNode;
}

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

// Object with string keys and JSON-serializable values
export type JsonObject = Record<string, JsonValue>;

export interface FetchResponse {
  data: JsonObject | null;
  error: {
    message?: string;
    status?: number;
    statusText?: string;
    body?: JsonObject;
  } | null;
  metadata: {
    redirect?: boolean;
    location?: string | null;
    url: string;
    method: HTMLFormMethod;
  };
}

export interface ApiState {
  inProgress: boolean;
  response: FetchResponse | null;
  error: Error | null;
}

type ApiActionValue = {
  [K in keyof ApiState]?: ApiState[K];
};

export type ApiAction = {
  type: string;
  value?: ApiActionValue;
};

export type NavOpts = { replace?: boolean; includeState?: boolean };
