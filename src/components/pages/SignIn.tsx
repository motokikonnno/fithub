import { signIn } from "next-auth/react";
import Image from "next/image";
import React from "react";
import styles from "../../styles/components/pages/SignIn.module.scss";

export const SignIn = React.memo(() => {
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
          <h1 className={styles.title}>Sign in to FitHub</h1>
          <div className={styles.signInButtonContainer}>
            <button
              className={styles.signInButton}
              onClick={() =>
                signIn("google", {
                  callbackUrl: "/",
                })
              }
            >
              <Image
                src={`/icons/google.svg`}
                width={24}
                height={24}
                alt="service-icon"
                className={styles.serviceIcon}
              />
              Sign in with Google
            </button>
            <button
              className={styles.signInButton}
              onClick={() =>
                signIn("github", {
                  callbackUrl: "/",
                })
              }
            >
              <Image
                src={`/icons/github.svg`}
                width={24}
                height={24}
                alt="service-icon"
                className={styles.serviceIcon}
              />
              Sign in with GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
