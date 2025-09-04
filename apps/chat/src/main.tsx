import { StrictMode, Fragment } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { createPortal } from "react-dom";
import AuthProvider from "@/Providers/Auth";
import router from "@Router/index.tsx";
import { navBar, appHost } from "@/Scripts/configure";

createRoot(appHost!).render(
  <StrictMode>
    <AuthProvider>
      <Fragment>
        {navBar ? createPortal(<Fragment></Fragment>, navBar) : null}
      </Fragment>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  </StrictMode>
);
