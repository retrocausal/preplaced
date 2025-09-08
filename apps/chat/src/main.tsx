import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import ChatCtxProvider from "@/Providers/AppContext";
import router from "@Router/index.tsx";
import { appHost } from "@/Scripts/configure";

createRoot(appHost!).render(
  <StrictMode>
    <ChatCtxProvider>
      <RouterProvider router={router}></RouterProvider>
    </ChatCtxProvider>
  </StrictMode>
);
