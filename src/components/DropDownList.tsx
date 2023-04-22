import Link from "next/link";
import React from "react";
import styles from "../styles/components/DropDownList.module.scss";

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
        <div className={styles.dropDownItem}>{item.title}</div>
      </Link>
    );
  }
);
