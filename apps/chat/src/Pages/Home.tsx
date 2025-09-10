import { AppStateContext } from "@/Providers/AppContext";
import { useContext, type FunctionComponent } from "react";
import styles from "@/Styles/Home.module.css";
import { Parley } from "@/Assets/parley";

const Home: FunctionComponent = () => {
  const appCtx = useContext(AppStateContext);
  const { conversation } = appCtx;
  console.log(conversation);

  return (
    <div className={styles.container}>
      {!conversation && (
        <div className={styles.branding}>
          <div className={styles.parley}>
            <Parley />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
