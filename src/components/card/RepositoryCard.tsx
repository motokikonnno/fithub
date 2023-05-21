import Link from "next/link";
import React, { FC } from "react";
import styles from "../../styles/components/card/RepositoryCard.module.scss";

type RepositoryCardProps = {
  index: number;
  // TODO: anyを変える
  repository: any;
};

export const RepositoryCard: FC<RepositoryCardProps> = React.memo(
  ({ index, repository }) => {
    return (
      <Link
        className={styles.repositoryName}
        href={`/repository/${repository.name}`}
        key={index}
      >
        <div className={styles.repositoryWrapper}>
          {repository.name}
          <span className={styles.repositoryType}>{repository.type}</span>
        </div>
      </Link>
    );
  }
);