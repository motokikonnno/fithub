import {
  mockRepositoryFile,
  mockRepositoryFolder,
} from "@/mock/mockRepositoryDetail";
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
  const url = decodeURI(router.asPath);
  const [currentTab, setCurrentTab] = useState("Log");
  const [currentUrl, setCurrentUrl] = useState("");
  const userName = "motoki";
  const repositoryName = "fithub";
  const urlSlashNumber = 3;

  useEffect(() => {
    if (query === "Issue") {
      setCurrentTab("Issue");
    } else {
      setCurrentTab("Log");
    }
  }, [query]);

  useEffect(() => {
    const startNumber =
      repositoryName.length + userName.length + urlSlashNumber;
    const path = url.substring(startNumber);
    setCurrentUrl(path);
  }, [url]);

  const handleCurrentTab = useCallback(
    (name: string) => {
      setCurrentTab(name);
      router.push(`/motoki/fithub/${name === "Log" ? "" : `?tab=${name}`}`);
    },
    [router]
  );

  const handleChangeUrl = (name: string) => {
    const path = currentUrl === "" ? name : `${currentUrl}/${name}`;
    router.push({
      pathname: `/[userName]/[repositoryName]/[path]`,
      query: {
        userName: "motoki",
        repositoryName: "fithub",
        path: path,
      },
    });
    setCurrentUrl(path);
  };

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
            {mockRepositoryFolder.map((folder, index) => (
              <div className={styles.listWrapper} key={index}>
                <div className={styles.leftContainer}>
                  <Image
                    src={"/icons/folder.svg"}
                    width={16}
                    height={14}
                    alt="folder-icon"
                  />
                  <span
                    className={styles.folderOrFileName}
                    onClick={() => handleChangeUrl(folder.name)}
                  >
                    {folder.name}
                  </span>
                </div>
                <span className={styles.updatedAt}>{folder.updatedAt}</span>
              </div>
            ))}
            {mockRepositoryFile.map((file, index) => (
              <div className={styles.listWrapper} key={index}>
                <div className={styles.leftContainer}>
                  <Image
                    src={"/icons/file.svg"}
                    width={16}
                    height={14}
                    alt="folder-icon"
                  />
                  <span className={styles.folderOrFileName}>{file.name}</span>
                </div>
                <span className={styles.updatedAt}>{file.updatedAt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
});
