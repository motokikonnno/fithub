import React from "react";
import styles from "../styles/components/Footer.module.scss";
import Image from "next/image";

export const Footer = React.memo(() => {
  return (
    <div className={styles.footerContainer}>
      <Image
        src={"/logo.png"}
        width={24}
        height={24}
        alt="logo"
        className={styles.logoIcon}
      />
      <span className={styles.text}>&copy; 2023 FitHub, Inc.</span>
    </div>
  );
});
