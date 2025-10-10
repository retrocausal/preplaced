import { Fragment, useContext, type FunctionComponent } from "react";
import { AppStateContext } from "@/Providers/AppContext";
import useFetchChats from "@/Hooks/Fetch-More";
import type { Chat } from "@/Types";
import styles from "@/Styles/Home.module.css";
import { Parley } from "@/Assets/parley";

const Home: FunctionComponent = () => {
  const appCtx = useContext(AppStateContext);
  const { conversation, displayName } = appCtx;
  const { conversations, _id: id } = conversation || {};
  const {
    REFS,
    inProgress,
    messages,
    id: conversationId,
  } = useFetchChats(id, JSON.stringify(conversations || []));
  const { target, sBottom, ancestor } = REFS;
  const hasMessages = conversationId && messages && messages.length > 0;

  return (
    <div className={styles.container}>
      {!conversation && (
        <div className={styles.branding}>
          <div className={styles.parley}>
            <Parley />
          </div>
        </div>
      )}
      {conversation && (
        <div className={styles.content} ref={ancestor}>
          <ul className={styles.list}>
            <li className={styles.loader} ref={target}>
              {inProgress && (
                <Fragment>
                  <div className={styles["loader-fragment"]}></div>
                  <div className={styles["loader-fragment"]}></div>
                  <div className={styles["loader-fragment"]}></div>
                </Fragment>
              )}
            </li>
            {hasMessages &&
              messages.map((msg, index) => (
                <Message
                  key={`${conversationId}${index}${msg.epoch?.timestamp}`}
                  msg={msg}
                  displayName={displayName ?? ""}
                />
              ))}
            <li
              key={id}
              id={conversationId}
              className={styles.sBottom}
              ref={sBottom}
            ></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;

interface Text {
  msg: Chat["conversations"][number];
  displayName: string;
}

const Message: FunctionComponent<Text> = ({ msg, displayName }) => {
  const byUser = msg.authorName === displayName;
  return (
    <li className={styles.item}>
      <span id="author" className={styles.author}>
        {byUser ? "You" : msg.authorName}
      </span>
      <span id="text" className={styles.text}>
        {msg.text}
      </span>
      <span id="time" className={styles.time}>
        {msg.epoch?.formatted}
      </span>
    </li>
  );
};
