import useFetchUser from "@/hooks/useFetchUser";
import { Repository } from "@/models/Repository";
import Link from "next/link";
import React, { FC } from "react";
import styles from "../../styles/components/item/RepositoryListItem.module.scss";
import { getTimeDiff } from "../../utils/getTime";

type RepositoryListItemProps = {
  repositories: Repository[];
  index: number;
  repository: Repository;
};

export const RepositoryListItem: FC<RepositoryListItemProps> = React.memo(
  ({ repositories, index, repository }) => {
    const createdAt = repository.created_at
      ? getTimeDiff(repository.created_at)
      : null;
    const { user } = useFetchUser(repository.user_id);
    return (
      <Link
        className={styles.repositoryName}
        href={`/user/${user?.id}/repository/${repository.id}`}
      >
        <div
          className={`${styles.repositoryItemWrapper} ${
            repositories.length - 1 === index && styles.lastItem
          }`}
        >
          <div>
            {repository.name}
            <span className={styles.repositoryItemType}>
              {repository.is_private === 1 ? "Public" : "private"}
            </span>
          </div>
          <div className={styles.updatedAt}>{createdAt}</div>
        </div>
      </Link>
    );
  }
);
