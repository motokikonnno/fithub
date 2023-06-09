import Image from "next/image";
import Link from "next/link";
import styles from "../styles/components/pages/404.module.scss";

const ErrorPage = () => {
  return (
    <div className={styles.elem}>
      <div className={styles.inner}>
        <div className={styles.layoutContainer}>
          <Image
            src={"/logo.png"}
            width={48}
            height={48}
            alt="logo-icon"
            className={styles.logoIcon}
          />
          <h1 className={styles.title}>Not found page</h1>
          <Link href={"/"} className={styles.homeButton}>
            Come back home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
