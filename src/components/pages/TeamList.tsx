import { teamMemberFactory } from "@/models/TeamMember";
import { UserBelongsToTeam, userFactory } from "@/models/User";
import Image from "next/image";
import Link from "next/link";
import React, { FC, useState } from "react";
import styles from "../../styles/components/pages/TeamList.module.scss";
import { AppLayout } from "../layouts/AppLayout";
import { Footer } from "../layouts/Footer";

export type TeamListProps = {
  user: UserBelongsToTeam;
};

export const TeamList: FC<TeamListProps> = React.memo(({ user }) => {
  const [userData, setUserData] = useState(user);

  const handleLeaveTeam = async (id: string) => {
    await teamMemberFactory().delete(id);
    const data = await userFactory().show(user.id);
    setUserData(data);
  };

  return (
    <AppLayout user={userData}>
      <div className={styles.layoutContainer}>
        <div className={styles.userLinkContainer}>
          <div className={styles.userDetailContainer}>
            {userData.image && (
              <Image
                src={userData.image}
                width={48}
                height={48}
                alt="user-icon"
                className={styles.userIcon}
              />
            )}
            <Link href={`/user/${userData.id}`} className={styles.userName}>
              {userData.name}
            </Link>
          </div>
          <Link href={`/user/${userData.id}`}>
            <button className={styles.profileButton}>Go to your profile</button>
          </Link>
        </div>
        <div className={styles.teamListContainer}>
          <h1 className={styles.pageTitle}>Teams</h1>
          <Link href={"/team/new"} className={styles.newTeamButton}>
            New team
          </Link>
        </div>
        {userData.team_members &&
          userData.team_members.map((teamMember, index) => (
            <div
              key={index}
              className={`${styles.teamContainer} ${
                userData.team_members &&
                userData.team_members.length - 1 === index &&
                styles.lastItem
              } ${index === 0 && styles.firstItem}`}
            >
              <div className={styles.teamDetailContainer}>
                <Image
                  src={teamMember.team.image}
                  width={20}
                  height={20}
                  alt="team-icon"
                  className={styles.teamImage}
                />
                <Link
                  href={`team/${teamMember.team.id}`}
                  className={styles.teamName}
                >
                  {teamMember.team.name}
                </Link>
              </div>
              <button
                className={styles.leaveButton}
                onClick={() => handleLeaveTeam(teamMember.id)}
              >
                Leave
              </button>
            </div>
          ))}
      </div>
      <Footer />
    </AppLayout>
  );
});
