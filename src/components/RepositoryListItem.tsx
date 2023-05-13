import Link from "next/link";
import React, { FC } from "react";
import styles from "../styles/components/RepositoryListItem.module.scss";

type RepositoryListItemProps = {
  repositories: any;
  index: number;
  repository: any;
};

export const RepositoryListItem: FC<RepositoryListItemProps> = React.memo(
  ({ repositories, index, repository }) => {
    return (
      <Link
        className={styles.repositoryName}
        href={`/motoki/${repository.name}`}
      >
        <div
          className={`${styles.repositoryItemWrapper} ${
            repositories.length - 1 === index && styles.lastItem
          }`}
        >
          <div>
            {repository.name}
            <span className={styles.repositoryItemType}>{repository.type}</span>
          </div>
          <div className={styles.updatedAt}>{repository.updatedAt}</div>
        </div>
      </Link>
    );
  }
);
