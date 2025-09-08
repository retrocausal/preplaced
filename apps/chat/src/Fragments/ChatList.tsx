import { LoaderCtx } from "@/Providers/LoaderContext";
import { Fragment, useContext, type FunctionComponent } from "react";

const ChatList: FunctionComponent = () => {
  const response = useContext(LoaderCtx);
  console.log("ChatList response", response);

  return <Fragment></Fragment>;
};

export default ChatList;
