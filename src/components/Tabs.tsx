import React, { FC } from "react";
import styles from "../styles/components/Tabs.module.scss";
import { itemType } from "./pages/MyProfile";

type TabsProps = {
  item: itemType;
  handleCurrentTab: (id: string) => void;
  currentTab: string;
};

export const Tabs: FC<TabsProps> = React.memo(
  ({ item, handleCurrentTab, currentTab }) => {
    return (
      <div
        className={`${styles.item} ${currentTab === item.id && styles.current}`}
        onClick={() => handleCurrentTab(item.id)}
      >
        {item.name}
      </div>
    );
  }
);
