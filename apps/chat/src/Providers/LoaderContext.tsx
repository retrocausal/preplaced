import { useEffect, createContext } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import type { LoaderContextProviderProps, LoaderData } from "@/Types";

declare type Type = LoaderData["fetched"];

const defaultContext: Type = {
  data: null,
  error: null,
  metadata: {},
};

const LoaderCtx = createContext<Type>({
  ...defaultContext,
});

function LoaderContextProvider({ children }: LoaderContextProviderProps) {
  const navigate = useNavigate();
  const loaderData = useLoaderData() as LoaderData;

  let { as: type, navigation } = loaderData || {};
  const { to, from } = navigation || {};
  useEffect(() => {
    if (type === "NAVIGATE" && to) {
      if (to && to === import.meta.env.VITE_APP_BASE) {
      }
      navigate(to, {
        state: { from: from || "" },
        replace: true,
      });
    }
  }, [type, from, to, navigate]);

  return (
    <LoaderCtx.Provider value={loaderData?.fetched ?? defaultContext}>
      {children || null}
    </LoaderCtx.Provider>
  );
}
export { LoaderCtx };
export default LoaderContextProvider;
