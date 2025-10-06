import { ApiClient } from "@/Core/Fetch";
import type { FetchConfig, FetchResponse } from "@/Types";
import type { HTMLFormMethod, NavigateOptions } from "react-router-dom";
import { useCallback, useReducer } from "react";
import { ApiReductions } from "@/Reductions/Api";
import { useNavigate } from "react-router-dom";

export default function useApiService(path: string, method: string) {
  const [state, dispatch] = useReducer(ApiReductions, {
    inProgress: false,
    response: null,
  });
  const navigate = useNavigate();
  const fetch = useCallback(
    async (config?: FetchConfig) => {
      dispatch({
        type: "INIT",
      });

      let response: FetchResponse = {
        data: null,
        error: null,
        metadata: { url: "", method: method as HTMLFormMethod },
      };
      try {
        const client = new ApiClient(method, config?.payload ?? null);
        if (config?.query) {
          client.query = config.query;
        }
        response = await client.execute(path);
      } catch (error) {
        response.error = { message: "Something went wrong!" };
      } finally {
        const navCfg: NavigateOptions = {
          replace: config?.navOptions?.replace ?? false,
          state: config?.navOptions?.includeState
            ? { from: window.location, ...response }
            : { from: window.location },
        };

        dispatch({ type: "COMPLETE", value: { response } });
        const { location } = response?.metadata;
        if (location) {
          navigate(location, navCfg);
        }
        return response;
      }
    },
    [path, method]
  );
  return { ...state, fetch };
}
