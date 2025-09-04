import styles from "@/Styles/Auth.module.css";
import type { FunctionComponent } from "react";
import useAuthentication from "@/Hooks/Login";

const Authenticate: FunctionComponent = () => {
  const { submit } = useAuthentication();
  return (
    <section className={styles.container}>
      <form method="POST" className={styles.auth} onSubmit={submit}>
        <div className={styles.heading}>
          <h3>Login to Parley</h3>
        </div>
        <div className={styles.message}></div>
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
