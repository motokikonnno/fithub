import { Repository } from "@/models/Repository";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import styles from "../../styles/components/item/RepositoryListItem.module.scss";
import { getTimeDiff } from "../../utils/getTime";

type RepositoryListItemProps = {
  repositories: Repository[];
  index: number;
  repository: Repository;
  toggleDelete: boolean;
  handleClose: (name?: string, id?: string) => void;
  type: "user" | "team";
  ownerId: string;
};

export const RepositoryListItem: FC<RepositoryListItemProps> = React.memo(
  ({
    repositories,
    index,
    repository,
    toggleDelete,
    handleClose,
    type,
    ownerId,
  }) => {
    const createdAt = repository.created_at
      ? getTimeDiff(repository.created_at)
      : null;
    return (
      <div
        className={`${styles.repositoryItemWrapper} ${
          repositories.length - 1 === index && styles.lastItem
        }`}
      >
        <div className={styles.leftContainer}>
          <Link
            className={styles.repositoryName}
            href={
              type === "user"
                ? `/user/${ownerId}/repository/${repository.id}`
                : `/team/${ownerId}/repository/${repository.id}`
            }
          >
            {repository.name}
          </Link>
          <span className={styles.repositoryItemType}>
            {repository.is_private === 1 ? "Public" : "Private"}
          </span>
        </div>
        <div className={styles.rightContainer}>
          <time className={styles.createdAt}>{createdAt}</time>
          {toggleDelete && (
            <Image
              src={"/icons/trash.svg"}
              width={14}
              height={16}
              alt="trash-icon"
              className={styles.trashIcon}
              onClick={() => handleClose(repository.name, repository.id)}
            />
          )}
        </div>
      </div>
    );
  }
);
