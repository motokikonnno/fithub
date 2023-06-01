import { Repository } from "@/models/Repository";
import Link from "next/link";
import React, { FC } from "react";
import styles from "../../styles/components/card/RepositoryCard.module.scss";

type RepositoryCardProps = {
  index: number;
  repository: Repository;
};

export const RepositoryCard: FC<RepositoryCardProps> = React.memo(
  ({ index, repository }) => {
    return (
      <Link
        className={styles.repositoryName}
        href={`/user/${repository.user_id}/repository/${repository.id}`}
        key={index}
      >
        <div className={styles.repositoryWrapper}>
          {repository.name}
          <span className={styles.repositoryType}>
            {repository.is_private === 1 ? "Public" : "Private"}
          </span>
        </div>
      </Link>
    );
  }
);
