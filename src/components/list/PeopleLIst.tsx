import React, { FC } from "react";
import styles from "../../styles/components/list/PeopleList.module.scss";
import Image from "next/image";
import Link from "next/link";
import { UserBelongsToTeam } from "@/models/User";
import { TeamMember } from "@/models/TeamMember";

type PeopleListProps = {
  people: UserBelongsToTeam;
  index: number;
  peoples: TeamMember[];
};

export const PeopleList: FC<PeopleListProps> = React.memo(
  ({ people, index, peoples }) => {
    return (
      <div
        className={`${styles.peopleDetailContainer} ${
          peoples.length - 1 !== index && styles.peopleDetailLast
        }`}
      >
        <div className={styles.rightContainer}>
          <span className={styles.peopleIconWrapper}>
            {people.image && (
              <Image
                src={people.image}
                width={48}
                height={48}
                alt="people-icon"
                className={styles.icon}
              />
            )}
          </span>
          <Link href={`/user/${people.id}`} className={styles.peopleName}>
            {people.name}
          </Link>
        </div>
        {people.team_members && (
          <span className={styles.teamNumber}>{`${people.team_members.length} ${
            people.team_members.length === 1 ? "team" : "teams"
          }`}</span>
        )}
      </div>
    );
  }
);
