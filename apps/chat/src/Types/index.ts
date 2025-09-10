import type { ReactNode } from "react";
export interface Context {
  username: string | null;
  displayName: string | null;
  chatCount?: number;
  conversation: null | Chat;
}
export type CtxActionValue = {
  [K in keyof Context]?: Context[K];
};
export interface CtxDispatch {
  type: string;
  value?: CtxActionValue;
}

export interface LoaderContextProviderProps {
  children?: ReactNode;
}

export type Chat = {
  _id: string;
  title: string;
  messageCount: number;
  participantCount: number;
  members: string[];
  conversations: {
    text: string;
    epoch?: { formatted: string; timestamp: number };
    authorName: string;
    edited?: boolean;
    readBy?: string[];
  }[];
};

export interface ChatLoaderData {
  chats: Chat[];
  total: number;
}

export type LoaderData = {
  navigation: { to?: string; from?: string };
  as: "NAVIGATE" | "FETCHRESPONSE";
  fetched?: FetchResponse;
};

export interface CtxProviderProps {
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
    location?: string | null;
    url?: string;
    method?: string;
    status?: number;
  };
}

export interface ApiState {
  inProgress: boolean;
  response: FetchResponse | null;
}

type ApiActionValue = {
  [K in keyof ApiState]?: ApiState[K];
};

export type ApiAction = {
  type: string;
  value?: ApiActionValue;
};

export type NavOpts = { replace?: boolean; includeState?: boolean };
