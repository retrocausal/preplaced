import { AppStateContext } from "@/Providers/AppContext";
import { useContext, useEffect, type FunctionComponent } from "react";
import styles from "@/Styles/Home.module.css";
import { Parley } from "@/Assets/parley";
import useFetchChats from "@/Hooks/Fetch-More";

const Home: FunctionComponent = () => {
  const appCtx = useContext(AppStateContext);
  const { conversation, displayName } = appCtx;
  const { conversations: messages, _id: id } = conversation || {};
  const { target, ancestor, sTop, sBottom, observer } = useFetchChats(id ?? "");
  useEffect(() => {
    let timeout: number;
    if (sBottom.current) {
      sBottom.current.scrollIntoView({ behavior: "smooth" });
      timeout = setTimeout(observer, 1000);
    }
    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [id, sBottom, observer]);

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
          {messages && messages.length > 0 && (
            <ul className={styles.list} ref={target}>
              <li className={styles.sTop} ref={sTop}></li>
              {messages.map((msg) => {
                const byUser = msg.authorName === displayName;
                return (
                  <li
                    key={`${id}${msg.epoch?.timestamp}`}
                    className={styles.item}
                  >
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
              })}
              <li className={styles.sBottom} ref={sBottom}></li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
