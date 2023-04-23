import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import styles from "../../styles/components/pages/RepositoryDetail.module.scss";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { Tabs } from "../Tabs";
import { itemType } from "./MyProfile";

export const RepositoryDetail = React.memo(() => {
  const items: itemType[] = [
    {
      id: "1",
      name: "Log",
    },
    {
      id: "2",
      name: "Issue",
    },
  ];

  const router = useRouter();
  const query = String(router.query.tab);
  const [currentTab, setCurrentTab] = useState("Log");

  useEffect(() => {
    if (query === "Issue") {
      setCurrentTab("Issue");
    } else {
      setCurrentTab("Log");
    }
  }, [query]);

  const handleCurrentTab = useCallback(
    (name: string) => {
      setCurrentTab(name);
      router.push(`/repository/fithub/${name === "Log" ? "" : `?tab=${name}`}`);
    },
    [router]
  );

  return (
    <>
      <Header />
      <div className={styles.backgroundColor}>
        <div className={styles.teamDetailContainer}>
          <span className={styles.teamNameHeader}>motoki</span>
          <span className={styles.sectionLine}>/</span>
          <span className={styles.teamNameHeader}>FitHub</span>
        </div>
        <div className={styles.tabsContainer}>
          {items.map((item, index) => (
            <Tabs
              item={item}
              handleCurrentTab={handleCurrentTab}
              currentTab={currentTab}
              key={index}
            />
          ))}
        </div>
      </div>
      {currentTab === "Log" && (
        <div className={styles.layoutContainer}>
          <div className={styles.logListWrapper}>
            <div className={styles.userInformationContainer}>
              <Image
                src={"/logo.png"}
                width={24}
                height={24}
                alt="user-icon"
                className={styles.userIcon}
              />
              <span className={styles.userName}>motoki</span>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
});
