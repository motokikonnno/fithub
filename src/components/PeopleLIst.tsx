import React, { FC } from "react";
import styles from "../styles/components/PeopleList.module.scss";
import Image from "next/image";
import Link from "next/link";

type PeopleListProps = {
  people: {
    name: string;
    icon: string;
    teamNumber: string;
  };
  index: number;
  peoples: any;
  isInvite: boolean;
};

export const PeopleList: FC<PeopleListProps> = React.memo(
  ({ people, index, peoples, isInvite }) => {
    return (
      <div
        className={`${styles.peopleDetailContainer} ${
          peoples.length - 1 !== index && styles.peopleDetailLast
        }`}
      >
        <div className={styles.rightContainer}>
          <span className={styles.peopleIconWrapper}>
            <Image
              src={people.icon}
              width={48}
              height={48}
              alt="people-icon"
              className={styles.icon}
            />
          </span>
          <Link href={"/dashboard"} className={styles.peopleName}>
            {people.name}
          </Link>
        </div>
        {isInvite ? (
          <button className={styles.inviteButton}>Invite</button>
        ) : (
          <span className={styles.teamNumber}>{`${people.teamNumber} ${
            people.teamNumber === "1" ? "team" : "teams"
          }`}</span>
        )}
      </div>
    );
  }
);
