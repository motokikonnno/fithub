import Image from "next/image";
import { useRouter } from "next/router";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import styles from "../../styles/components/pages/RepositoryDetail.module.scss";
import { BreadCrumb } from "../BreadCrumb";
import { Footer } from "../layouts/Footer";
import { Header } from "../layouts/Header";
import { Modal } from "../Modal";
import { itemType } from "./UserProfile";
import { FolderItem } from "../item/FolderItem";
import { FileItem } from "../item/FileItem";
import { Tiptap } from "../Tiptap";
import Link from "next/link";
import { Repository, repositoryFactory } from "@/models/Repository";
import { Folder, folderFactory } from "@/models/Folder";
import { File, fileFactory } from "@/models/File";
import { UserBelongsToTeam } from "@/models/User";
import { Team } from "@/models/Team";
import { CurrentCommit, currentCommitFactory } from "@/models/CurrentCommit";
import { changeBodyPartsNumber } from "@/utils/changeBodyPartsNumber";
import { Commit, commitFactory } from "@/models/Commit";
import { getTimeDiff } from "@/utils/getTime";
import { PercentageBar } from "../PercentageBar";
import useFetchCount from "@/hooks/useFetchCount";
import { Count } from "@/models/Count";

export type RepositoryDetailProps = {
  repository: Repository;
  folders: Folder[];
  files: File[];
  owner: UserBelongsToTeam | Team;
  sessionUserId: string | undefined;
  type: "user" | "team";
  items: itemType[];
  isSessionUser: boolean;
  countData: Count;
};

type bodyPartsType = {
  id: number;
  name: string;
};

const NUM_COMMITS_PER_PAGE = 10;

export const RepositoryDetail: FC<RepositoryDetailProps> = React.memo(
  ({
    repository,
    folders,
    files,
    owner,
    type,
    sessionUserId,
    items,
    isSessionUser,
    countData,
  }) => {
    const modalHeaderItems = [
      {
        name: "commit",
      },
      {
        name: "merge",
      },
    ];

    const bodyPartsList: bodyPartsType[] = [
      {
        id: 1,
        name: "Chest",
      },
      {
        id: 2,
        name: "Back",
      },
      { id: 3, name: "Legs" },
      {
        id: 4,
        name: "Arms",
      },
      {
        id: 5,
        name: "Shoulders",
      },
      {
        id: 6,
        name: "Abdominal",
      },
      {
        id: 7,
        name: "Other",
      },
    ];

    const { count, countMutate } = useFetchCount(
      `${repository.id}_repository`,
      countData
    );
    const router = useRouter();
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
    const [toggleInput, setToggleInput] = useState(false);
    const [defaultText, setDefaultText] = useState("");
    const [currentType, setCurrentType] = useState<"folder" | "file" | "">("");
    const [isReadme, setIsReadme] = useState(repository.is_read_me);
    const [bodyParts, setBodyParts] = useState<bodyPartsType>();
    const [isBodyPartsFlag, setBodyPartsFlag] = useState(false);
    const [commitText, setCommitText] = useState("");
    const [currentCommitData, setCurrentCommitData] =
      useState<CurrentCommit[]>();
    const [commitData, setCommitData] = useState<Commit[]>();
    const [page, setPage] = useState(1);
    const [commitDataNumber, setCommitDataNumber] = useState<Number>();
    const dropDownListRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const handlePopstate = async () => {
        if (currentFolderName.length === 0) {
          router.push(
            type === "user" ? `/user/${owner.id}` : `/team/${owner.id}`
          );
        } else {
          // Folderとパンくずリストを一つ前の状態に戻す
          const breadCrumbsArray = currentFolderName.slice(0, -1);
          const parentIndex = breadCrumbsArray.length - 1;
          const parentItem = breadCrumbsArray[parentIndex];
          const filterFolder = await folderFactory().index(
            repository.id,
            parentItem
              ? `${repository.id}_${parentItem.id}`
              : `${repository.id}_`
          );
          setCurrentFolderName(breadCrumbsArray);
          setCurrentFolder(filterFolder);

          // Fileを一つ前の状態に戻す
          const filterFile = await fileFactory().index(
            repository.id,
            parentItem
              ? `${repository.id}_${parentItem.id}`
              : `${repository.id}_`
          );
          setCurrentFile(filterFile);
        }
      };
      history.pushState(null, "", null);
      window.addEventListener("popstate", handlePopstate, false);
      return () => {
        removeEventListener("popstate", handlePopstate, false);
      };
    }, [currentFolderName, files, folders, owner, repository.id, router, type]);

    useEffect(() => {
      setToggleSelectType(false);
    }, [currentFolderName]);

    useEffect(() => {
      fetchCommits(currentFolderOrFileId, page);
    }, [page, setPage]);

    useEffect(() => {
      const handleClickToCloseInput = (event: MouseEvent) => {
        if (!(event.target instanceof HTMLElement)) {
          return;
        }
        const inputElement = inputRef.current;
        const dropdownElement = dropDownListRef.current;
        if (
          (inputElement && inputElement?.contains(event.target)) ||
          (dropdownElement && dropdownElement?.contains(event.target))
        )
          return;
        setCreateType("");
        setToggleInput(false);
        setInputText("");
        setBodyPartsFlag(false);
      };
      window.addEventListener("click", handleClickToCloseInput, true);
      return () => {
        window.removeEventListener("click", handleClickToCloseInput);
      };
    }, []);

    const filterFolderWithFile = useCallback(
      async (id: string) => {
        const folderArray = await folderFactory().index(
          repository.id,
          `${repository.id}_${id}`
        );
        const fileArray = await fileFactory().index(
          repository.id,
          `${repository.id}_${id}`
        );
        if (folderArray && fileArray) {
          setCurrentFolder(folderArray);
          setCurrentFile(fileArray);
          setParentFolder(id);
        }
      },
      [repository.id]
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

    const handleSetCommitData = useCallback(
      async (id: string) => {
        fetchCommits(id, page);
        fetchCurrentCommits(id);
        setCurrentFolderOrFileId(id);
        setIsVisible(!isVisible);
        setModalHeader("commit");
        setBodyParts(undefined);
      },
      [
        currentCommitData,
        commitData,
        setCommitData,
        setCurrentCommitData,
        isVisible,
      ]
    );

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

    const handleDeleteFolder = async () => {
      if (currentType === "file") {
        await fileFactory().delete(currentFolderOrFileId);
        fetchFiles();
      } else {
        await folderFactory().delete(currentFolderOrFileId);
        fetchFolders();
      }
      setConfirmModal(false);
    };

    const fetchFolders = async () => {
      const newFolder = await folderFactory().index(
        repository.id,
        `${repository.id}_${parentFolder}`
      );
      setCurrentFolder(newFolder);
    };

    const fetchFiles = async () => {
      const newFile = await fileFactory().index(
        repository.id,
        `${repository.id}_${parentFolder}`
      );
      setCurrentFile(newFile);
    };

    const submitEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        if (isComposition) return;
        e.preventDefault();
        if (sessionUserId) {
          if (createType === "folder") {
            await folderFactory().create({
              name: inputText,
              parent_id: parentFolder,
              repository_id: repository.id,
              user_id: sessionUserId,
            });
            fetchFolders();
          } else if (createType === "file") {
            await fileFactory().create({
              name: inputText,
              parent_id: parentFolder,
              repository_id: repository.id,
              user_id: sessionUserId,
            });
            fetchFiles();
          }
        }
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
          fetchFolders();
        } else {
          await fileFactory().update({
            id: currentFolderOrFileId,
            name: defaultText,
          });
          fetchFiles();
        }
        setToggleInput(false);
      }
    };

    const handleSetComposition = useCallback(() => {
      setIsComposition(!isComposition);
    }, [isComposition]);

    const handleCurrentType = (type: "folder" | "file") => {
      setCurrentType(type);
    };

    const handleUpdateReadme = async () => {
      const updateIsReadme = await repositoryFactory().update({
        id: repository.id,
        is_read_me: true,
      });
      setIsReadme(updateIsReadme.is_read_me);
    };

    const fetchCurrentCommits = async (id?: string) => {
      if (sessionUserId) {
        const currentCommits = await currentCommitFactory().index(
          id ? id : currentFolderOrFileId,
          sessionUserId
        );
        setCurrentCommitData(currentCommits);
      }
    };

    const fetchCommits = async (id: string, page: number) => {
      if (sessionUserId) {
        const commits = await commitFactory().index(
          id ? id : currentFolderOrFileId,
          page
        );
        setCommitData(commits.commits);
        setCommitDataNumber(commits.totalNumber);
      }
    };

    const handleCreateCurrentCommit = async () => {
      if (commitText === "") return;
      if (sessionUserId)
        await currentCommitFactory().create({
          user_id: sessionUserId,
          file_id: currentFolderOrFileId,
          message: commitText,
          body_parts: bodyParts ? bodyParts.id : 7,
        });
      fetchCurrentCommits();
      setBodyParts(undefined);
      setCommitText("");
    };

    const handleDeleteCurrentCommit = async (id: string) => {
      await currentCommitFactory().delete(id);
      fetchCurrentCommits();
    };

    const handleMergeCommit = async () => {
      if (currentCommitData && sessionUserId) {
        await commitFactory().create({
          file_id: currentFolderOrFileId,
          user_id: sessionUserId,
        });
        fetchCurrentCommits();
        fetchCommits(currentFolderOrFileId, page);
        countMutate();
      }
    };

    return (
      <>
        <Header />
        <nav className={styles.backgroundColor}>
          <h1 className={styles.teamDetailContainer}>
            <Link
              href={type === "user" ? `/user/${owner.id}` : `/team/${owner.id}`}
              className={styles.teamNameHeader}
            >
              {owner.name}
            </Link>
            <span className={styles.sectionLine}>/</span>
            <Link
              href={
                type === "user"
                  ? `/user/${owner.id}/repository/${repository.id}`
                  : `/team/${owner.id}/repository/${repository.id}`
              }
              className={styles.teamNameHeader}
            >
              {repository.name}
            </Link>
          </h1>
          <div className={styles.tabsContainer}>
            {items.map((item, index) =>
              item.id === "2" ? (
                <Link
                  key={index}
                  href={`/${type}/[${
                    type === "team" ? "team_id" : "user_id"
                  }]/repository/[repository_id]/issue`}
                  as={item.link}
                  className={styles.item}
                >
                  {item.name}
                </Link>
              ) : (
                <div key={index} className={`${styles.current} ${styles.item}`}>
                  {item.name}
                </div>
              )
            )}
          </div>
        </nav>
        <div className={styles.layoutContainer}>
          <BreadCrumb
            folderTitle={currentFolderName}
            repository={repository.name}
            handleViewRepository={handleViewRepository}
          />
          <section className={styles.logListWrapper}>
            <div className={styles.repositoryHeader}>
              <div className={styles.userInformationContainer}>
                {owner.image && (
                  <Image
                    src={owner.image}
                    width={24}
                    height={24}
                    alt="user-icon"
                    className={styles.userIcon}
                  />
                )}
                <h2 className={styles.userName}>{owner.name}</h2>
              </div>
              {(currentFolder.length > 0 || currentFile.length > 0) && (
                <div
                  className={`${styles.select} ${
                    toggleAction && styles.redColor
                  }`}
                  onClick={handleCloseAction}
                >
                  Select
                </div>
              )}
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
                  handleModalClose={handleSetCommitData}
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
                  <header className={styles.headerContainer}>
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
                          {name === "merge" &&
                            currentCommitData &&
                            currentCommitData.length > 0 && (
                              <span className={styles.currentCommitDataNumber}>
                                {currentCommitData?.length}
                              </span>
                            )}
                          <p className={styles.itemTitle}>{name}</p>
                        </div>
                      ))}
                    </div>
                  </header>
                  {modalHeader === "commit" && (
                    <>
                      <div className={styles.commitBackground}>
                        {commitData &&
                          commitData.map((commit, index) => (
                            <ul
                              key={index}
                              className={styles.commitListContainer}
                            >
                              <li className={styles.commitMessage}>
                                <div>{commit.message}</div>
                                <div
                                  className={`${styles.bodyPart} ${
                                    styles[
                                      changeBodyPartsNumber(commit.body_parts)
                                        .color
                                    ]
                                  }`}
                                >
                                  {
                                    changeBodyPartsNumber(commit.body_parts)
                                      .bodyPartName
                                  }
                                </div>
                              </li>
                              <li className={styles.rightContainer}>
                                <div className={styles.commitUser}>
                                  {commit.user.image && (
                                    <Image
                                      src={commit.user.image}
                                      width={14}
                                      height={14}
                                      alt="user-icon"
                                      className={styles.userIcon}
                                    />
                                  )}
                                  {commit.user.name}
                                </div>
                                <div className={styles.commitUpdatedAt}>
                                  {getTimeDiff(commit.created_at)}
                                </div>
                              </li>
                            </ul>
                          ))}
                        {commitDataNumber &&
                          NUM_COMMITS_PER_PAGE * page < commitDataNumber && (
                            <div
                              onClick={() => setPage(page + 1)}
                              className={styles.moreButton}
                            >
                              Show more...
                            </div>
                          )}
                      </div>
                      <div className={styles.commitFormLayout}>
                        <textarea
                          placeholder="commit message"
                          className={styles.textarea}
                          value={commitText}
                          onChange={(e) => setCommitText(e.target.value)}
                        ></textarea>
                        <div className={styles.commitRightContainer}>
                          <div
                            className={styles.bodyPartsSelectForm}
                            onClick={() => setBodyPartsFlag(!isBodyPartsFlag)}
                            ref={dropDownListRef}
                          >
                            {bodyParts ? bodyParts.name : "Body part select"}
                            {isBodyPartsFlag && (
                              <ul className={styles.bodyPartList}>
                                {bodyPartsList.map((body, index) => (
                                  <li
                                    key={index}
                                    className={styles.bodyItem}
                                    onClick={() => setBodyParts(body)}
                                  >
                                    {body.name}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <button
                            className={styles.commitButton}
                            onClick={handleCreateCurrentCommit}
                          >
                            commit
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  {modalHeader === "merge" && (
                    <>
                      <div className={styles.commitBackground}>
                        {currentCommitData &&
                          currentCommitData.map((commit, index) => (
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
                                    onClick={() =>
                                      handleDeleteCurrentCommit(commit.id)
                                    }
                                  />
                                )}
                              </div>
                              <div
                                className={`${styles.bodyPart} ${
                                  styles[
                                    changeBodyPartsNumber(commit.body_parts)
                                      .color
                                  ]
                                }`}
                              >
                                {
                                  changeBodyPartsNumber(commit.body_parts)
                                    .bodyPartName
                                }
                              </div>
                            </div>
                          ))}
                      </div>
                      <button
                        className={styles.mergeButton}
                        onClick={handleMergeCommit}
                      >
                        merge
                      </button>
                    </>
                  )}
                </div>
              </Modal>
            )}

            {createType === "" ? (
              isSessionUser && (
                <section className={styles.addFolderOrFile}>
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
                </section>
              )
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
          </section>
          {count && Object.keys(count).length !== 0 && (
            <section className={styles.percentages}>
              <h2 className={styles.sectionTitle}>Body parts percentages</h2>
              <div className={styles.percentageBarWrapper}>
                <PercentageBar count={count} />
              </div>
            </section>
          )}
          {isReadme ? (
            <section className={styles.readmeWrapper}>
              <div className={styles.readmeContainer}>
                <Image
                  src={"/icons/list-ul.svg"}
                  width={16}
                  height={16}
                  alt="list-ul-icon"
                />
                <h2 className={styles.readme}>README.md</h2>
              </div>
              <Tiptap
                text={repository.read_me}
                repository={repository}
                type={"readme"}
              />
            </section>
          ) : (
            <div className={styles.createReadmeButtonContainer}>
              <button
                className={styles.createReadmeButton}
                onClick={handleUpdateReadme}
              >
                Create README.md
              </button>
            </div>
          )}
        </div>
        <Footer />
      </>
    );
  }
);
