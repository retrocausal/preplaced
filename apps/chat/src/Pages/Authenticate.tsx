import styles from "@/Styles/Auth.module.css";
import type { FunctionComponent } from "react";
import useAuthentication from "@/Hooks/Login";
import { useLocation } from "react-router-dom";

const Authenticate: FunctionComponent = () => {
  const location = useLocation();
  const from = (location.state as { from: Location })?.from?.pathname || "/";
  const { submit, exception, setException } = useAuthentication(from);
  return (
    <section className={styles.container}>
      <form
        method="POST"
        className={styles.auth}
        onSubmit={submit}
        onBeforeInput={() => setException(null)}
      >
        <div className={styles.heading}>
          <h3>Login to Parley</h3>
        </div>
        <div className={styles.message}>
          {exception && <div className={styles.error}>{exception}</div>}
        </div>
        <div className={styles.section}>
          <label> Username</label>
          <input type="text" name="username" />
        </div>

        <div className={styles.section}>
          <label> Password</label>
          <input type="password" name="password" />
        </div>
        <div className={styles.section}>
          <button type="submit">Proceed</button>
        </div>
      </form>
    </section>
  );
};

export default Authenticate;
