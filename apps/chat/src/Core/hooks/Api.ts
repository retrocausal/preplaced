import NetOps from "@/Core/Fetch";
import type { FetchResponse, JsonObject, NavOpts } from "@/Types";
import type { HTMLFormMethod, NavigateOptions } from "react-router-dom";
import { useCallback, useReducer } from "react";
import { ApiReductions } from "@/Reductions/Api";
import { useNavigate } from "react-router-dom";

class ApiClient extends NetOps {
  constructor(method: string, body: JsonObject | FormData | null = null) {
    super();
    this.method = method as HTMLFormMethod;
    this.signal = new AbortController().signal;
    if (body) this.body = body;
  }

  execute(path: string): Promise<FetchResponse> {
    let src = path;
    if (!path.startsWith("/")) src = `/${path}`;
    return super.execute(src);
  }
}

export default function useApiService(path: string, method: string) {
  const [state, dispatch] = useReducer(ApiReductions, {
    inProgress: false,
    response: null,
    error: null,
  });
  const navigate = useNavigate();
  const fetch = useCallback(
    async (payload?: JsonObject | FormData, navOptions?: NavOpts) => {
      dispatch({
        type: "INIT",
      });
      let response: FetchResponse = {
        data: null,
        error: null,
        metadata: { url: "", method: method as HTMLFormMethod },
      };
      try {
        const client = new ApiClient(method, payload ?? null);
        response = await client.execute(path);
        const { error: exception } = response;
        if (exception) {
          throw new Error(
            exception.message ?? "Api Service failed to fetch data"
          );
        }
        dispatch({
          type: "SUCCESS",
          value: { response },
        });
      } catch (error) {
        dispatch({
          type: "FAILURE",
          value: { response, error: error as Error },
        });
      } finally {
        const navCfg: NavigateOptions = {
          replace: navOptions?.replace ?? false,
          state: navOptions?.includeState
            ? { from: window.location, ...response }
            : { from: window.location },
        };

        const { redirect, location } = response?.metadata;
        if (redirect && location) {
          navigate(location, navCfg);
        }
      }
    },
    [path, method]
  );
  return { ...state, fetch };
}
