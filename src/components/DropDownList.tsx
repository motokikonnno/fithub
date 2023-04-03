import React from "react";
import styles from "../styles/components/DropDownList.module.scss";

type DropDownListProps = {
  item: string;
};

export const DropDownList: React.FC<DropDownListProps> = React.memo(
  ({ item }) => {
    return <div className={styles.dropDownItem}>{item}</div>;
  }
);
