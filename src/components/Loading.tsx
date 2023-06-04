import styles from "../styles/components/Loading.module.scss";

export const Loading = () => {
  return (
    <div className={styles.ring}>
      loading<span className={styles.animation}></span>
    </div>
  );
};
