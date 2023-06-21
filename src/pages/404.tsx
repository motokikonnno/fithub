import { SEO } from "@/components/SEO";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import styles from "../styles/components/pages/404.module.scss";

type ErrorPageProps = {
  isSession?: boolean;
};

const ErrorPage: FC<ErrorPageProps> = ({ isSession }) => {
  return (
    <>
      <SEO title={"FitHub"} url={"/404"} />
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
            <h1 className={styles.title}>
              {isSession
                ? "You do not have sufficient privileges in your account"
                : "Not found page"}
            </h1>
            <Link href={"/"} className={styles.homeButton}>
              Come back home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
