import React, { FC } from "react";
import styles from "../styles/components/Tabs.module.scss";
import { itemType } from "./pages/MyProfile";

type TabsProps = {
  item: itemType;
  handleCurrentTab: (name: string) => void;
  currentTab: string | string[];
};

export const Tabs: FC<TabsProps> = React.memo(
  ({ item, handleCurrentTab, currentTab }) => {
    return (
      <div
        className={`${styles.item} ${
          currentTab === item.name && styles.current
        }`}
        onClick={() => handleCurrentTab(item.name)}
      >
        {item.name}
      </div>
    );
  }
);
