import {
  mockRepositoryFile,
  mockRepositoryFolder,
} from "@/mock/mockRepositoryDetail";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "../../styles/components/pages/RepositoryDetail.module.scss";
import { BreadCrumb } from "../BreadCrumb";
import { Footer } from "../layouts/Footer";
import { Header } from "../layouts/Header";
import { Modal } from "../Modal";
import { Tabs } from "../Tabs";
import { itemType } from "./MyProfile";
import { Issue } from "./Issue";
import { FolderItem } from "../item/FolderItem";
import { FileItem } from "../item/FileItem";
import { Tiptap } from "../Tiptap";
import Link from "next/link";

export type IssueStateType = {
  id: string;
  type: string;
  issues: IssueType[];
};

export type IssueType = {
  id: string;
  title: string;
  createdAt: string;
  createdUser: string;
  type: string;
};

export const items: itemType[] = [
  {
    id: "1",
    name: "Log",
  },
  {
    id: "2",
    name: "Issue",
  },
];

export const RepositoryDetail = React.memo(() => {
  const issueList = [
    {
      id: "1",
      title: "記事が投稿されたら通知がいくようにする",
      createdAt: "4 days ago",
      createdUser: "motoki",
      type: "To do",
    },
    {
      id: "2",
      title: "記事が投稿されたら通知がいくようにする",
      createdAt: "4 days ago",
      createdUser: "motoki",
      type: "To do",
    },
    {
      id: "3",
      title: "記事が投稿されたら通知がいくようにする",
      createdAt: "4 days ago",
      createdUser: "motoki",
      type: "Doing",
    },
    {
      id: "4",
      title: "記事が投稿されたら通知がいくようにする",
      createdAt: "4 days ago",
      createdUser: "motoki",
      type: "Doing",
    },
    {
      id: "5",
      title: "記事が投稿されたら通知がいくようにする",
      createdAt: "4 days ago",
      createdUser: "motoki",
      type: "Done",
    },
    {
      id: "6",
      title: "記事が投稿されたら通知がいくようにする",
      createdAt: "4 days ago",
      createdUser: "motoki",
      type: "Done",
    },
  ];
  const issueTodo = issueList.filter(({ type }) => type === "To do");
  const issueDoing = issueList.filter(({ type }) => type === "Doing");
  const issueDone = issueList.filter(({ type }) => type === "Done");

  const modalHeaderItems = [
    {
      name: "commit",
    },
    {
      name: "merge",
    },
  ];

  const commitData = [
    {
      id: "1",
      message: "feat-ログイン機能",
      userName: "motoki",
      updatedAt: "2023/05/12",
    },
    {
      id: "2",
      message: "feat-ログイン機能",
      userName: "motoki",
      updatedAt: "2023/05/12",
    },
    {
      id: "3",
      message: "feat-ログイン機能",
      userName: "motoki",
      updatedAt: "2023/05/12",
    },
    {
      id: "4",
      message: "feat-ログイン機能",
      userName: "motoki",
      updatedAt: "2023/05/12",
    },
    {
      id: "5",
      message: "feat-ログイン機能",
      userName: "motoki",
      updatedAt: "2023/05/12",
    },
  ];

  const issueData = [
    {
      id: "1",
      type: "To do",
      issues: issueTodo,
    },
    {
      id: "2",
      type: "Doing",
      issues: issueDoing,
    },
    {
      id: "3",
      type: "Done",
      issues: issueDone,
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
  const [modalHeader, setModalHeader] = useState("commit");
  const [isHover, setIsHover] = useState(false);
  const [hoverValue, setHoverValue] = useState("");
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
    setModalHeader("commit");
  };

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: string
  ) => {
    const target = e.target as HTMLDivElement;
    const elementId = target.getAttribute("id");
    if (elementId === id) {
      setHoverValue(elementId);
      setIsHover(!isHover);
    }
  };

  const submitEnter = (key: any) => {
    return;
  };

  return (
    <>
      <Header />
      <div className={styles.backgroundColor}>
        <div className={styles.teamDetailContainer}>
          <Link href={`/mypage`} className={styles.teamNameHeader}>
            motoki
          </Link>
          <span className={styles.sectionLine}>/</span>
          <Link href={`/motoki/fithub`} className={styles.teamNameHeader}>
            FitHub
          </Link>
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
              <FolderItem
                folder={folder}
                handleCurrentFolder={handleCurrentFolder}
                key={index}
              />
            ))}
            {currentFile.map((file, index) => (
              <FileItem
                file={file}
                handleModalClose={handleModalClose}
                key={index}
              />
            ))}
            {isVisible && (
              <Modal isVisible={isVisible} handleClose={handleModalClose}>
                <div className={styles.modalBackground}>
                  <div className={styles.headerContainer}>
                    <div className={styles.xmarkIconWrapper}>
                      <Image
                        src={"/icons/xmark.svg"}
                        width={20}
                        height={20}
                        alt="xmark-icon"
                        className={styles.xmarkIcon}
                        onClick={handleModalClose}
                      />
                    </div>
                    <div className={styles.headerItemContainer}>
                      {modalHeaderItems.map(({ name }, index) => (
                        <div
                          className={`${styles.headerItem} ${
                            modalHeader === name && styles.activeBackground
                          }`}
                          key={index}
                          onClick={() => setModalHeader(name)}
                        >
                          <Image
                            src={`/icons/${name}.svg`}
                            width={12}
                            height={12}
                            alt="header-item-icon"
                            className={styles.itemIcon}
                          />
                          <p className={styles.itemTitle}>{name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {modalHeader === "commit" && (
                    <>
                      <div className={styles.commitBackground}>
                        {commitData.map((commit, index) => (
                          <ul
                            key={index}
                            className={styles.commitListContainer}
                          >
                            <li className={styles.commitMessage}>
                              {commit.message}
                            </li>
                            <li className={styles.rightContainer}>
                              <li className={styles.commitUser}>
                                {commit.userName}
                              </li>
                              <li className={styles.commitUpdatedAt}>
                                {commit.updatedAt}
                              </li>
                            </li>
                          </ul>
                        ))}
                      </div>
                      <div className={styles.commitFormLayout}>
                        <textarea
                          placeholder="commit message"
                          className={styles.textarea}
                        ></textarea>
                        <button className={styles.commitButton}>commit</button>
                      </div>
                    </>
                  )}
                  {modalHeader === "merge" && (
                    <>
                      <div className={styles.commitBackground}>
                        {commitData.map((commit, index) => (
                          <div
                            key={index}
                            className={styles.committedListContainer}
                          >
                            <div
                              className={styles.committedMessage}
                              id={commit.id}
                              onMouseEnter={(e) =>
                                handleMouseEnter(e, commit.id)
                              }
                              onMouseLeave={() => setIsHover(false)}
                            >
                              {commit.message}
                              {isHover && hoverValue === commit.id && (
                                <Image
                                  src={"/icons/trash.svg"}
                                  width={16}
                                  height={16}
                                  alt="trash-icon"
                                  className={styles.trashIcon}
                                />
                              )}
                            </div>
                            <input
                              type={"checkbox"}
                              className={styles.checkbox}
                            />
                          </div>
                        ))}
                      </div>
                      <button className={styles.mergeButton}>merge</button>
                    </>
                  )}
                </div>
              </Modal>
            )}

            {createType === "" ? (
              <>
                <div
                  className={styles.addFileOrFolderWrapper}
                  onClick={() => setToggleSelectType(!toggleSelectType)}
                >
                  <Image
                    src={
                      toggleSelectType
                        ? "/icons/minus.svg"
                        : "/icons/plus-gray.svg"
                    }
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
          <div className={styles.readmeWrapper}>
            <div className={styles.readmeContainer}>
              <Image
                src={"/icons/list-ul.svg"}
                width={16}
                height={16}
                alt="list-ul-icon"
              />
              <div className={styles.readme}>README.md</div>
            </div>
            <Tiptap />
          </div>
        </div>
      )}
      {currentTab === "Issue" && <Issue issues={issueData} />}
      <Footer />
    </>
  );
});
