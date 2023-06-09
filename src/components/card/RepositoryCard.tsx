import { Repository } from "@/models/Repository";
import Link from "next/link";
import React, { FC } from "react";
import styles from "../../styles/components/card/RepositoryCard.module.scss";

type RepositoryCardProps = {
  index: number;
  repository: Repository;
  type: "user" | "team";
};

export const RepositoryCard: FC<RepositoryCardProps> = React.memo(
  ({ index, repository, type }) => {
    return (
      <Link
        className={styles.repositoryName}
        href={
          type === "user"
            ? `/user/${repository.user_id}/repository/${repository.id}`
            : `/team/${repository.team_id}/repository/${repository.id}`
        }
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
