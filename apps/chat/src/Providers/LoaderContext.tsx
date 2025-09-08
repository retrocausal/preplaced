import { useEffect, createContext } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import type { LoaderContextProviderProps, LoaderData } from "@/Types";

const LoaderCtx = createContext({} as LoaderData["fetched"]);

function LoaderContextProvider({ children }: LoaderContextProviderProps) {
  const navigate = useNavigate();
  const loaderData = useLoaderData() as LoaderData;

  const { as: type, navigation, fetched = {} } = loaderData || {};
  const { to, from } = navigation || {};
  useEffect(() => {
    if (type === "NAVIGATE" && to) {
      navigate(to, {
        state: { from: from || "" },
        replace: true,
      });
    }
  }, [type, from, to, navigate]);

  return (
    <LoaderCtx.Provider value={fetched}>{children || null}</LoaderCtx.Provider>
  );
}
export { LoaderCtx };
export default LoaderContextProvider;
