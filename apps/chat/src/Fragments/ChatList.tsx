import { AppDispatchContext } from "@/Providers/AppContext";
import { LoaderCtx } from "@/Providers/LoaderContext";
import type { ChatLoaderData, FetchResponse, Chat } from "@/Types";
import {
  Fragment,
  useCallback,
  useContext,
  useState,
  type FunctionComponent,
} from "react";
import styles from "@/Styles/Chatlist.module.css";
import { CaretDown, CaretRight } from "@/Assets/carets";

const ChatList: FunctionComponent = () => {
  const response = useContext(LoaderCtx);
  const { data = {} }: FetchResponse = response || {
    data: null,
    error: null,
    metadata: {},
  };
  const chats = (data?.chats || []) as ChatLoaderData["chats"];
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
  const appDispatch = useContext(AppDispatchContext);
  const relayCurrentChat = useCallback(
    (chat: Chat) => {
      appDispatch?.({
        type: "CONVERSATION",
        value: { conversation: { ...chat } },
      });
    },
    [appDispatch]
  );

  return (
    <div className={styles.container}>
      <section className={styles.drawer}>
        <h3 className={styles.title}>Conversations</h3>
        <div className={styles.toggle} onClick={() => setDrawerOpen((c) => !c)}>
          {drawerOpen && <CaretDown />}
          {!drawerOpen && <CaretRight />}
        </div>
      </section>
      {chats && chats.length > 0 && (
        <Fragment>
          {drawerOpen && (
            <ul className={styles.list}>
              {chats.map((chat, i) => (
                <ChatCard
                  key={`chat-${i}`}
                  {...chat}
                  relayTap={relayCurrentChat}
                />
              ))}
            </ul>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default ChatList;

const ChatCard: FunctionComponent<Chat & { relayTap: (c: Chat) => void }> = (
  props
) => {
  const { relayTap, ...chat } = props;
  const { title, conversations: messages } = chat;
  const date = messages[messages.length - 1]?.epoch?.formatted ?? "";
  let cardHead = title;
  return (
    <li className={styles.item} onClick={() => relayTap(chat)}>
      <div className={styles.head}>
        <span className={styles.text}>{cardHead}</span>
        <span className={styles.date}>{date}</span>
      </div>
    </li>
  );
};
