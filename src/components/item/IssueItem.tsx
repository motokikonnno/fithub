import { Issue } from "@/models/Issue";
import { Repository } from "@/models/Repository";
import { Team } from "@/models/Team";
import { User } from "@/models/User";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import styles from "../../styles/components/item/IssueItem.module.scss";

type IssueItemProps = {
  task: Issue;
  repository: Repository;
  owner: User | Team;
  ownerType: "user" | "team";
};

export const IssueItem: FC<IssueItemProps> = React.memo(
  ({ task, owner, repository, ownerType }) => {
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
          <Link
            href={
              ownerType === "user"
                ? `/user/${owner.id}/repository/${repository.id}/issue/${task.id}`
                : `/team/${owner.id}/repository/${repository.id}/issue/${task.id}`
            }
            className={styles.issueTitle}
          >
            {task.title}
          </Link>
        </div>
        <p
          className={styles.createUser}
        >{`#${task.issue_number} opened by ${task.user.name}`}</p>
      </>
    );
  }
);
