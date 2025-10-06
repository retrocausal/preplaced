import { AppStateContext } from "@/Providers/AppContext";
import { Fragment, useContext, useEffect, type FunctionComponent } from "react";
import styles from "@/Styles/Home.module.css";
import { Parley } from "@/Assets/parley";
import useFetchChats from "@/Hooks/Fetch-More";
import type { Chat } from "@/Types";

const Home: FunctionComponent = () => {
  const appCtx = useContext(AppStateContext);
  const { conversation, displayName } = appCtx;
  const { conversations, _id: id } = conversation || {};
  const { target, ancestor, sBottom, observer, inProgress, messages } =
    useFetchChats(id, conversations);
  useEffect(() => {
    let timeout: number;
    sBottom.current?.scrollIntoView({ behavior: "smooth" });
    timeout = setTimeout(observer, 1000);
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [sBottom, observer]);

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
            {messages &&
              messages.length > 0 &&
              messages.map((msg) => (
                <Message
                  key={`${msg.epoch?.timestamp}-${id}`}
                  msg={msg}
                  displayName={displayName ?? ""}
                />
              ))}
            <li key={id} className={styles.sBottom} ref={sBottom}></li>
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
