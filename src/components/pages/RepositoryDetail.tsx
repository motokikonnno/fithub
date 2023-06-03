import Image from "next/image";
import { useRouter } from "next/router";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import styles from "../../styles/components/pages/RepositoryDetail.module.scss";
import { BreadCrumb } from "../BreadCrumb";
import { Footer } from "../layouts/Footer";
import { Header } from "../layouts/Header";
import { Modal } from "../Modal";
import { Tabs } from "../Tabs";
import { itemType } from "./UserProfile";
import { Issue } from "./Issue";
import { FolderItem } from "../item/FolderItem";
import { FileItem } from "../item/FileItem";
import { Tiptap } from "../Tiptap";
import Link from "next/link";
import { Repository, repositoryFactory } from "@/models/Repository";
import { Folder, folderFactory } from "@/models/Folder";
import { File, fileFactory } from "@/models/File";
import { User } from "@/models/User";

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

export type RepositoryDetailProps = {
  repository: Repository;
  folders: Folder[];
  files: File[];
  user: User;
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

export const RepositoryDetail: FC<RepositoryDetailProps> = React.memo(
  ({ repository, folders, files, user }) => {
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
    const [currentFolder, setCurrentFolder] = useState<Folder[]>(folders);
    const [currentFile, setCurrentFile] = useState<File[]>(files);
    const [createType, setCreateType] = useState("");
    const [toggleSelectType, setToggleSelectType] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [currentFolderName, setCurrentFolderName] = useState<itemType[]>([]);
    const [modalHeader, setModalHeader] = useState("commit");
    const [isHover, setIsHover] = useState(false);
    const [hoverValue, setHoverValue] = useState("");
    const [inputText, setInputText] = useState("");
    const [isComposition, setIsComposition] = useState(false);
    const [parentFolder, setParentFolder] = useState("");
    const [toggleAction, setToggleAction] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [currentFolderOrFileId, setCurrentFolderOrFileId] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [toggleInput, setToggleInput] = useState(false);
    const [defaultText, setDefaultText] = useState("");
    const [currentType, setCurrentType] = useState<"folder" | "file" | "">("");

    useEffect(() => {
      const handlePopstate = () => {
        if (currentFolderName.length === 0) {
          router.push(`/user/${user.id}`);
        } else {
          // Folderとパンくずリストを一つ前の状態に戻す
          const breadCrumbsArray = currentFolderName.slice(0, -1);
          const parentIndex = breadCrumbsArray.length - 1;
          const parentItem = breadCrumbsArray[parentIndex];
          const filterFolder =
            folders &&
            folders.filter(({ parent_id }) =>
              parentItem ? parent_id === parentItem.id : parent_id === ""
            );
          setCurrentFolderName(breadCrumbsArray);
          setCurrentFolder(filterFolder);

          // Fileを一つ前の状態に戻す
          const filterFile =
            files &&
            files.filter(({ parent_id }) =>
              parentItem ? parent_id === parentItem.id : parent_id === ""
            );
          setCurrentFile(filterFile);
        }
      };
      history.pushState(null, "", null);
      window.addEventListener("popstate", handlePopstate, false);
      return () => {
        removeEventListener("popstate", handlePopstate, false);
      };
    }, [currentFolderName, files, folders, user, router]);

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
        setToggleInput(false);
      };
      window.addEventListener("click", handleClickToCloseInput, true);
      return () => {
        window.removeEventListener("click", handleClickToCloseInput);
      };
    }, []);

    const handleCurrentTab = useCallback(
      (name: string) => {
        setCurrentTab(name);
        router.push(
          `/user/${user.id}/repository/${repository.id}/${
            name === "Log" ? "" : `?tab=${name}`
          }`
        );
      },
      [repository, user, router]
    );

    const filterFolderWithFile = useCallback(
      async (id: string) => {
        const newRepository = await repositoryFactory().show(repository.id);
        if (newRepository.folders && newRepository.files) {
          const folderArray = newRepository.folders.filter(
            ({ parent_id }) => id === parent_id
          );
          const fileArray = newRepository.files.filter(
            ({ parent_id }) => id === parent_id
          );
          setCurrentFolder(folderArray);
          setCurrentFile(fileArray);
          setParentFolder(id);
        }
      },
      [repository]
    );

    const handleCurrentFolder = useCallback(
      (id: string, name: string) => {
        const breadcrumbArray = [...currentFolderName, { id: id, name: name }];
        setCurrentFolderName(breadcrumbArray);
        setParentFolder(id);
        filterFolderWithFile(id);
        setToggleAction(false);
      },
      [currentFolderName, filterFolderWithFile]
    );

    const handleViewRepository = (id: string) => {
      const indexNumber = currentFolderName.findIndex(
        (folder) => folder.id === id
      );
      const breadcrumbArray = currentFolderName.slice(0, indexNumber + 1);
      setCurrentFolderName(breadcrumbArray);
      setParentFolder("");
      filterFolderWithFile(id);
      setToggleAction(false);
    };

    const handleSelectType = (type: "folder" | "file") => {
      setToggleSelectType(false);
      if (type === "folder") {
        setCreateType("folder");
      } else {
        setCreateType("file");
      }
    };

    const handleModalClose = useCallback(() => {
      setIsVisible(!isVisible);
      setModalHeader("commit");
    }, [isVisible]);

    const handleConfirmModal = useCallback(
      (id?: string) => {
        setConfirmModal(!confirmModal);
        if (id) setCurrentFolderOrFileId(id);
      },
      [confirmModal]
    );

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

    const fetchRepository = async () => {
      const newRepository = await repositoryFactory().show(repository.id);
      const newFolder = newRepository.folders?.filter(
        ({ parent_id }) => parent_id === parentFolder
      );
      const newFile = newRepository.files?.filter(
        ({ parent_id }) => parent_id === parentFolder
      );
      if (newFolder && newFile) {
        setCurrentFolder(newFolder);
        setCurrentFile(newFile);
      }
    };

    const handleDeleteFolder = async () => {
      if (currentType === "file") {
        await fileFactory().delete(currentFolderOrFileId);
      } else {
        await folderFactory().delete(currentFolderOrFileId);
      }
      fetchRepository();
      setConfirmModal(false);
    };

    const submitEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        if (isComposition) return;
        e.preventDefault();
        if (createType === "folder") {
          await folderFactory().create({
            name: inputText,
            parent_id: parentFolder,
            repository_id: repository.id,
          });
        } else if (createType === "file") {
          await fileFactory().create({
            name: inputText,
            parent_id: parentFolder,
            repository_id: repository.id,
          });
        }
        fetchRepository();
        setInputText("");
        setCreateType("");
      }
    };

    const toggleEditInput = useCallback(
      (id: string, name: string, type: "file" | "folder") => {
        setCurrentFolderOrFileId(id);
        setDefaultText(name);
        setToggleInput(!toggleInput);
        setCurrentType(type);
      },
      [toggleInput]
    );

    const handleSetDefaultText = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setDefaultText(e.target.value);
    };

    const handleCloseCreateType = () => {
      setToggleSelectType(!toggleSelectType);
      if (toggleAction) setToggleAction(false);
    };

    const handleCloseAction = () => {
      setToggleAction(!toggleAction);
      if (toggleSelectType) setToggleSelectType(false);
    };

    const submitEditEnter = async (
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (e.key === "Enter") {
        if (isComposition) return;
        e.preventDefault();
        if (currentType === "folder") {
          await folderFactory().update({
            id: currentFolderOrFileId,
            name: defaultText,
          });
        } else {
          await fileFactory().update({
            id: currentFolderOrFileId,
            name: defaultText,
          });
        }
        fetchRepository();
        setToggleInput(false);
      }
    };

    const handleSetComposition = useCallback(() => {
      setIsComposition(!isComposition);
    }, [isComposition]);

    const handleCurrentType = (type: "folder" | "file") => {
      setCurrentType(type);
    };

    return (
      <>
        <Header />
        <div className={styles.backgroundColor}>
          <div className={styles.teamDetailContainer}>
            <Link href={`/user/${user.id}`} className={styles.teamNameHeader}>
              {repository.user?.name}
            </Link>
            <span className={styles.sectionLine}>/</span>
            <Link
              href={`/user/${user.id}/repository/${repository.id}`}
              className={styles.teamNameHeader}
            >
              {repository.name}
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
              repository={repository.name}
              handleViewRepository={handleViewRepository}
            />
            <div className={styles.logListWrapper}>
              <div className={styles.repositoryHeader}>
                <div className={styles.userInformationContainer}>
                  {repository.user?.image && (
                    <Image
                      src={repository.user?.image}
                      width={24}
                      height={24}
                      alt="user-icon"
                      className={styles.userIcon}
                    />
                  )}

                  <span className={styles.userName}>
                    {repository.user?.name}
                  </span>
                </div>
                <div
                  className={`${styles.select} ${
                    toggleAction && styles.redColor
                  }`}
                  onClick={handleCloseAction}
                >
                  Select
                </div>
              </div>
              {confirmModal && (
                <Modal
                  isVisible={confirmModal}
                  handleClose={() => handleConfirmModal()}
                >
                  <div className={styles.confirmModalBackground}>
                    <p className={styles.confirmText}>
                      Do you really want to delete this?
                    </p>
                    <div className={styles.confirmContainer}>
                      <button
                        className={styles.deleteButton}
                        onClick={handleDeleteFolder}
                      >
                        Delete
                      </button>
                      <button
                        className={styles.backButton}
                        onClick={() => handleConfirmModal()}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                </Modal>
              )}

              {currentFolder &&
                currentFolder.map((folder, index) => (
                  <FolderItem
                    folder={folder}
                    handleCurrentFolder={handleCurrentFolder}
                    handleConfirmModal={handleConfirmModal}
                    handleSetDefaultText={handleSetDefaultText}
                    toggleEditInput={toggleEditInput}
                    toggleAction={toggleAction}
                    toggleInput={toggleInput}
                    key={index}
                    defaultText={defaultText}
                    handleSetComposing={handleSetComposition}
                    currentFolderOrFileId={currentFolderOrFileId}
                    submitEditEnter={submitEditEnter}
                    inputRef={inputRef}
                  />
                ))}
              {currentFile &&
                currentFile.map((file, index) => (
                  <FileItem
                    file={file}
                    handleModalClose={handleModalClose}
                    key={index}
                    handleConfirmModal={handleConfirmModal}
                    handleSetDefaultText={handleSetDefaultText}
                    toggleEditInput={toggleEditInput}
                    toggleAction={toggleAction}
                    toggleInput={toggleInput}
                    defaultText={defaultText}
                    handleSetComposing={handleSetComposition}
                    currentFolderOrFileId={currentFolderOrFileId}
                    submitEditEnter={submitEditEnter}
                    handleCurrentType={handleCurrentType}
                    inputRef={inputRef}
                  />
                ))}
              {isVisible && (
                <Modal isVisible={isVisible} handleClose={handleModalClose}>
                  <div className={styles.modalBackground}>
                    <div className={styles.headerContainer}>
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
                          <button className={styles.commitButton}>
                            commit
                          </button>
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
                    onClick={handleCloseCreateType}
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
                    value={inputText}
                    onKeyDown={(e) => submitEnter(e)}
                    onChange={(e) => setInputText(e.target.value)}
                    onCompositionStart={() => setIsComposition(true)}
                    onCompositionEnd={() => setIsComposition(false)}
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
  }
);
