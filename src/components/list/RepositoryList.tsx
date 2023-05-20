import React, { FC } from "react";
import { repositoriesType } from "../pages/MyProfile";
import styles from "../../styles/components/list/RepositoryList.module.scss";
import { InputSearch } from "../InputSearch";
import Image from "next/image";
import Link from "next/link";
import { RepositoryListItem } from "../item/RepositoryListItem";

type RepositoryListProps = {
  repositories: repositoriesType[];
};

export const RepositoryList: FC<RepositoryListProps> = React.memo(
  ({ repositories }) => {
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
          <Link href={"/repository/new"} className={styles.link}>
            <div className={styles.newRepositoryButton}>
              <Image
                src={"/icons/add-repository.svg"}
                width={13}
                height={13}
                alt="repositoryアイコン"
                className={styles.repositoryIcon}
              />
              New
            </div>
          </Link>
        </div>
        {repositories.map((repository, index) => (
          <RepositoryListItem
            repositories={repositories}
            repository={repository}
            index={index}
            key={index}
          />
        ))}
      </div>
    );
  }
);
