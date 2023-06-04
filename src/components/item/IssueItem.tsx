import useFetchUser from "@/hooks/useFetchUser";
import { Issue } from "@/models/Issue";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import styles from "../../styles/components/item/IssueItem.module.scss";

type IssueItemProps = {
  task: Issue;
};

export const IssueItem: FC<IssueItemProps> = React.memo(({ task }) => {
  const { user } = useFetchUser(task.user_id);
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
      >{`#${task.id} opened by ${user?.name}`}</p>
    </>
  );
});
