import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import styles from "../../styles/components/list/DropDownList.module.scss";

type DropDownListProps = {
  item: {
    title: string;
    link: string;
  };
};

export const DropDownList: React.FC<DropDownListProps> = React.memo(
  ({ item }) => {
    return (
      <Link href={item.link} className={styles.link}>
        {item.title === "Sign out" ? (
          <div
            className={styles.dropDownItem}
            onClick={() => signOut({ callbackUrl: "/sign_in" })}
          >
            {item.title}
          </div>
        ) : (
          <div className={styles.dropDownItem}>{item.title}</div>
        )}
      </Link>
    );
  }
);
