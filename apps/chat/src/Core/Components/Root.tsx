import { createPortal } from "react-dom";
import { Outlet } from "react-router-dom";
import { type FunctionComponent } from "react";
import ChatList from "@/Fragments/ChatList";
import { navBar } from "@/Scripts/configure";
import LoaderContextProvider from "@/Providers/LoaderContext";
import ChatCtxProvider from "@/Providers/AppContext";

const Root: FunctionComponent = () => {
  return (
    <ChatCtxProvider>
      <LoaderContextProvider>
        {navBar ? createPortal(<ChatList />, navBar) : null}
        <Outlet />
      </LoaderContextProvider>
    </ChatCtxProvider>
  );
};

export default Root;
