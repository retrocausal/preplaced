import { createPortal } from "react-dom";
import { Outlet } from "react-router-dom";
import { type FunctionComponent, Fragment } from "react";
import ChatList from "@/Fragments/ChatList";
import { navBar } from "@/Scripts/configure";
import LoaderContextProvider from "@/Providers/LoaderContext";

const Root: FunctionComponent = () => {
  return (
    <Fragment>
      <LoaderContextProvider>
        {navBar ? createPortal(<ChatList />, navBar) : null}
        <Outlet />
      </LoaderContextProvider>
    </Fragment>
  );
};

export default Root;
