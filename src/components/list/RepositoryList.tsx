import React, { FC, useCallback, useEffect, useState } from "react";
import styles from "../../styles/components/list/RepositoryList.module.scss";
import { InputSearch } from "../InputSearch";
import Image from "next/image";
import Link from "next/link";
import { RepositoryListItem } from "../item/RepositoryListItem";
import { Repository, repositoryFactory } from "@/models/Repository";
import { Modal } from "../Modal";
import { User, userFactory } from "@/models/User";
import { Team, teamFactory } from "@/models/Team";

type RepositoryListProps = {
  repositories: Repository[];
  owner: User | Team;
  type: "user" | "team";
  isSessionUser: boolean;
};

export const RepositoryList: FC<RepositoryListProps> = React.memo(
  ({ repositories, owner, type, isSessionUser }) => {
    const sortRepositories = [...repositories].sort((a, b) => {
      return Date.parse(b.created_at) - Date.parse(a.created_at);
    });
    const privateRepositories = sortRepositories.filter(
      ({ is_private }) => is_private === 1
    );
    const [repositoriesData, setRepositoriesData] = useState(sortRepositories);
    const [isVisible, setIsVisible] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [deleteText, setDeleteText] = useState("");
    const [repositoryId, setRepositoryId] = useState("");
    const [currentRepository, setCurrentRepository] = useState("");
    const [toggleDelete, setToggleDelete] = useState(false);

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
      await repositoryFactory().delete(repositoryId);
      if (type === "user") {
        const userData = await userFactory().show(owner.id);
        if (userData.repositories) {
          setRepositoriesData(userData.repositories);
        }
      } else if (type === "team") {
        const teamData = await teamFactory().show(owner.id);
        if (teamData.repositories) {
          setRepositoriesData(teamData.repositories);
        }
      }
      setDeleteText("");
      setIsVisible(false);
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
              {(!isSessionUser && privateRepositories.length > 0) ||
                (isSessionUser && sortRepositories.length > 0 && (
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
        {isSessionUser
          ? repositoriesData.map((repository, index) => (
              <RepositoryListItem
                repositories={repositories}
                repository={repository}
                index={index}
                key={index}
                toggleDelete={toggleDelete}
                handleClose={handleClose}
                type={type}
                ownerId={owner.id}
              />
            ))
          : privateRepositories.map((repository, index) => (
              <RepositoryListItem
                repositories={repositories}
                repository={repository}
                index={index}
                key={index}
                toggleDelete={toggleDelete}
                handleClose={handleClose}
                type={type}
                ownerId={owner.id}
              />
            ))}
      </div>
    );
  }
);
