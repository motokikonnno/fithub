import React, { FC, useCallback, useEffect, useState } from "react";
import styles from "../../styles/components/list/RepositoryList.module.scss";
import { InputSearch } from "../InputSearch";
import Image from "next/image";
import Link from "next/link";
import { RepositoryListItem } from "../item/RepositoryListItem";
import { Repository, repositoryFactory } from "@/models/Repository";
import { Modal } from "../Modal";
import { User } from "@/models/User";
import { Team } from "@/models/Team";
import { Pagination } from "../Pagination";

type RepositoryListProps = {
  repositories?: { repositories: Repository[]; totalNumber: number };
  owner: User | Team;
  type: "user" | "team";
  isSessionUser: boolean;
  isSearch: boolean;
  searchText: string;
  handleChangeSearchText: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => Promise<void>;
  isValidating: boolean;
};

const NUM_REPOSITORIES_PER_PAGE = 8;

export const RepositoryList: FC<RepositoryListProps> = React.memo(
  ({
    repositories,
    owner,
    type,
    isSessionUser,
    isSearch,
    searchText,
    handleChangeSearchText,
    onSubmit,
    isValidating,
  }) => {
    const [repositoriesData, setRepositoriesData] = useState(
      repositories?.repositories
    );
    const [isVisible, setIsVisible] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [deleteText, setDeleteText] = useState("");
    const [repositoryId, setRepositoryId] = useState("");
    const [currentRepository, setCurrentRepository] = useState("");
    const [toggleDelete, setToggleDelete] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const temp = new Array(NUM_REPOSITORIES_PER_PAGE).fill(0);

    useEffect(() => {
      setRepositoriesData(repositories?.repositories);
    }, [repositories]);

    useEffect(() => {
      setIsDisabled(currentRepository !== deleteText);
    }, [deleteText, currentRepository]);

    const handleClose = useCallback(
      (name?: string, id?: string) => {
        if (name && id) {
          setRepositoryId(id);
          setCurrentRepository(name);
        }
        setIsVisible(!isVisible);
      },
      [isVisible]
    );

    const deleteRepository = async () => {
      setIsDisabled(true);
      await repositoryFactory().delete(repositoryId);
      const data = await repositoryFactory().index({
        queries: {
          owner_id: owner.id,
          isPrivate: isSessionUser,
          type: type,
          page: currentPage,
        },
      });
      if (data.repositories) {
        setRepositoriesData(data.repositories);
      }
      setDeleteText("");
      setIsVisible(false);
      setIsDisabled(false);
    };

    const handlePaginate = async (page: number) => {
      const repositories = await repositoryFactory().index({
        queries: {
          owner_id: owner.id,
          isPrivate: isSessionUser,
          type: type,
          page: page,
        },
      });
      setRepositoriesData(repositories.repositories);
      setCurrentPage(page);
    };

    return (
      <div className={styles.repositoryListContainer}>
        <div className={styles.actionContainer}>
          <div className={styles.inputWrapper}>
            <InputSearch
              placeholder={"Find a repository..."}
              backgroundColor={"#fff"}
              color={"#656d76"}
              borderColor={"#d0d7de"}
              searchText={searchText}
              handleChangeSearchText={handleChangeSearchText}
              onSubmit={onSubmit}
            />
          </div>
          {isSessionUser && (
            <div className={styles.rightContainer}>
              <Link
                href={{
                  pathname: "/repository/new",
                  query:
                    type === "user"
                      ? { type: type }
                      : { type: type, team_id: owner.id },
                }}
                className={styles.link}
              >
                <button className={styles.newRepositoryButton}>
                  <Image
                    src={"/icons/add-repository.svg"}
                    width={13}
                    height={13}
                    alt="repositoryアイコン"
                    className={styles.repositoryIcon}
                  />
                  New
                </button>
              </Link>
              {(!isSessionUser &&
                repositories &&
                repositories.repositories.length > 0) ||
                (isSessionUser &&
                  repositories &&
                  repositories.repositories.length > 0 && (
                    <button
                      className={`${styles.selectButton} ${
                        toggleDelete && styles.redColor
                      }`}
                      onClick={() => setToggleDelete(!toggleDelete)}
                    >
                      Select
                    </button>
                  ))}
            </div>
          )}
        </div>
        {isVisible && (
          <Modal isVisible={isVisible} handleClose={handleClose}>
            <div className={styles.background}>
              <p className={styles.description}>
                You must enter the repository name below to proceed with the
                deletion.
              </p>
              <div className={styles.repositoryName}>{currentRepository}</div>
              <input
                type="text"
                onChange={(e) => setDeleteText(e.target.value)}
                className={styles.input}
                autoFocus={true}
              />
              <button
                disabled={isDisabled}
                className={isDisabled ? styles.disabled : styles.deleteButton}
                onClick={deleteRepository}
              >
                DELETE
              </button>
            </div>
          </Modal>
        )}
        {isValidating ? (
          <div className={styles.skeltonRepository}>
            {temp.map((_, i) => (
              <div className={styles.skeltonRepositoryItem} key={i}></div>
            ))}
          </div>
        ) : (
          repositories &&
          repositoriesData?.map((repository, index) => (
            <RepositoryListItem
              repositories={repositories.repositories}
              repository={repository}
              index={index}
              key={index}
              toggleDelete={toggleDelete}
              handleClose={handleClose}
              type={type}
              ownerId={owner.id}
            />
          ))
        )}
        {!isSearch && repositories && (
          <Pagination
            totalNumber={repositories?.totalNumber}
            perPage={NUM_REPOSITORIES_PER_PAGE}
            onChange={(e) => handlePaginate(e.page)}
          />
        )}
      </div>
    );
  }
);
