import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import styles from "../../styles/components/item/IssueItem.module.scss";
import { IssueType } from "../pages/RepositoryDetail";

type IssueItemProps = {
  task: IssueType;
};

export const IssueItem: FC<IssueItemProps> = React.memo(({ task }) => {
  return (
    <>
      <div className={styles.issueTitleContainer}>
        <div className={styles.circleDotIcon}>
          <Image
            src={
              task.type === "Done"
                ? "/icons/circle-check.svg"
                : "/icons/circle-dot.svg"
            }
            width={16}
            height={16}
            alt="circle-dot-icon"
          />
        </div>
        <Link href={"/motoki/fithub/issue/1"} className={styles.issueTitle}>
          {task.title}
        </Link>
      </div>
      <p
        className={styles.createUser}
      >{`#${task.id} opened by ${task.createdUser}`}</p>
    </>
  );
});
