import {
  mockRepositoryFile,
  mockRepositoryFolder,
} from "@/mock/mockRepositoryDetail";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "../../styles/components/pages/RepositoryDetail.module.scss";
import { BreadCrumb } from "../BreadCrumb";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { Modal } from "../Modal";
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
  const initialFolder = mockRepositoryFolder.filter(
    ({ parent_id }) => parent_id === ""
  );
  const initialFile = mockRepositoryFile.filter(
    ({ folder_id }) => folder_id === ""
  );
  const [currentFolder, setCurrentFolder] = useState(initialFolder);
  const [currentFile, setCurrentFile] = useState(initialFile);
  const [createType, setCreateType] = useState("");
  const [toggleSelectType, setToggleSelectType] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentFolderName, setCurrentFolderName] = useState<itemType[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query === "Issue") {
      setCurrentTab("Issue");
    } else {
      setCurrentTab("Log");
    }
  }, [query]);

  useEffect(() => {
    setToggleSelectType(false);
  }, [currentFolderName]);

  useEffect(() => {
    const handleClickToCloseInput = (event: MouseEvent) => {
      if (!(event.target instanceof HTMLElement)) {
        return;
      }
      const inputElement = inputRef.current;
      if (inputElement && inputElement?.contains(event.target)) return;
      setCreateType("");
    };
    window.addEventListener("click", handleClickToCloseInput, true);
    return () => {
      window.removeEventListener("click", handleClickToCloseInput);
    };
  }, []);

  const handleCurrentTab = useCallback(
    (name: string) => {
      setCurrentTab(name);
      router.push(`/motoki/fithub/${name === "Log" ? "" : `?tab=${name}`}`);
    },
    [router]
  );

  const filterFolderWithFile = (id: string) => {
    const folderArray = mockRepositoryFolder.filter(
      ({ parent_id }) => id === parent_id
    );
    const fileArray = mockRepositoryFile.filter(
      ({ folder_id }) => id === folder_id
    );
    setCurrentFolder(folderArray);
    setCurrentFile(fileArray);
  };

  const handleCurrentFolder = (id: string, name: string) => {
    const breadcrumbArray = [...currentFolderName, { id: id, name: name }];
    setCurrentFolderName(breadcrumbArray);
    filterFolderWithFile(id);
  };

  const handleViewRepository = (id: string) => {
    const indexNumber = currentFolderName.findIndex(
      (folder) => folder.id === id
    );
    const breadcrumbArray = currentFolderName.slice(0, indexNumber + 1);
    setCurrentFolderName(breadcrumbArray);
    filterFolderWithFile(id);
  };

  const handleSelectType = (type: "folder" | "file") => {
    setToggleSelectType(false);
    if (type === "folder") {
      setCreateType("folder");
    } else {
      setCreateType("file");
    }
  };

  const handleModalClose = () => {
    setIsVisible(!isVisible);
  };

  const submitEnter = (key: any) => {
    return;
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
          <BreadCrumb
            folderTitle={currentFolderName}
            repository={"fithub"}
            handleViewRepository={handleViewRepository}
          />
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
            {currentFolder.map((folder, index) => (
              <div className={styles.listWrapper} key={index}>
                <div className={styles.leftContainer}>
                  <Image
                    src={"/icons/folder.svg"}
                    width={16}
                    height={14}
                    alt="folder-icon"
                    className={styles.icon}
                  />
                  <span
                    className={styles.folderOrFileName}
                    onClick={() => handleCurrentFolder(folder.id, folder.name)}
                  >
                    {folder.name}
                  </span>
                </div>
                <span className={styles.updatedAt}>{folder.updatedAt}</span>
              </div>
            ))}
            {currentFile.map((file, index) => (
              <div key={index}>
                <div className={styles.listWrapper}>
                  <div className={styles.leftContainer}>
                    <Image
                      src={"/icons/file.svg"}
                      width={16}
                      height={14}
                      alt="folder-icon"
                      className={styles.icon}
                    />
                    <span
                      className={styles.folderOrFileName}
                      onClick={handleModalClose}
                    >
                      {file.name}
                    </span>
                  </div>
                  <span className={styles.updatedAt}>{file.updatedAt}</span>
                </div>
                {isVisible && (
                  <Modal isVisible={isVisible} handleClose={handleModalClose}>
                    <div className={styles.modalBackground}>
                      <div className={styles.header}>
                        <Image
                          src={"/icons/xmark.svg"}
                          width={20}
                          height={20}
                          alt="xmark-icon"
                          className={styles.xmarkIcon}
                        />
                      </div>
                    </div>
                  </Modal>
                )}
              </div>
            ))}
            {createType === "" ? (
              <>
                <div
                  className={styles.addFileOrFolderWrapper}
                  onClick={() => setToggleSelectType(!toggleSelectType)}
                >
                  <Image
                    src={"/icons/plus-gray.svg"}
                    width={16}
                    height={16}
                    alt="plus-icon"
                    className={styles.icon}
                  />
                </div>
                {toggleSelectType && (
                  <ul className={styles.dropdownWrapper}>
                    <div
                      className={styles.dropdownItemContainer}
                      onClick={() => handleSelectType("folder")}
                    >
                      <Image
                        src={"/icons/folder.svg"}
                        width={16}
                        height={14}
                        alt="folder-icon"
                      />
                      <li className={styles.dropdownItem}>Add folder</li>
                    </div>
                    <div
                      className={styles.dropdownItemContainer}
                      onClick={() => handleSelectType("file")}
                    >
                      <Image
                        src={"/icons/file.svg"}
                        width={16}
                        height={14}
                        alt="file-icon"
                      />
                      <li className={styles.dropdownItem}>Add File</li>
                    </div>
                  </ul>
                )}
              </>
            ) : (
              <div className={styles.inputContainer}>
                <Image
                  src={`/icons/${createType}.svg`}
                  width={16}
                  height={14}
                  alt="file-icon"
                />
                <input
                  className={styles.createInputWrapper}
                  autoFocus={true}
                  onKeyDown={(e) => submitEnter(e)}
                  ref={inputRef}
                />
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
});
