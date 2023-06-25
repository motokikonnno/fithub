import { teamMemberFactory } from "@/models/TeamMember";
import { UserBelongsToTeam, userFactory } from "@/models/User";
import Image from "next/image";
import Link from "next/link";
import React, { FC, useState } from "react";
import styles from "../../styles/components/pages/TeamList.module.scss";
import { AppLayout } from "../layouts/AppLayout";
import { Footer } from "../layouts/Footer";
import { Modal } from "../Modal";
import { SEO } from "../SEO";

export type TeamListProps = {
  user: UserBelongsToTeam;
};

export const TeamList: FC<TeamListProps> = React.memo(({ user }) => {
  const [userData, setUserData] = useState(user);
  const [isVisible, setIsVisible] = useState(false);
  const [memberId, setMemberId] = useState("");

  const handleClose = (id?: string) => {
    if (id) {
      setMemberId(id);
    }
    setIsVisible(!isVisible);
  };

  const handleLeaveTeam = async () => {
    await teamMemberFactory().delete(memberId);
    const data = await userFactory().show(user.id);
    setUserData(data);
    setIsVisible(false);
  };

  return (
    <>
      {" "}
      {user?.name && <SEO title={user.name} url={"/team"} />}
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
              <button className={styles.profileButton}>
                Go to your profile
              </button>
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
                  onClick={() => handleClose(teamMember.id)}
                >
                  Leave
                </button>
                {isVisible && (
                  <Modal isVisible={isVisible} handleClose={handleClose}>
                    <div className={styles.confirmModalBackground}>
                      <p className={styles.confirmText}>
                        Do you really want to leave this?
                      </p>
                      <div className={styles.confirmContainer}>
                        <div
                          className={styles.deleteButton}
                          onClick={handleLeaveTeam}
                        >
                          Leave
                        </div>
                        <div
                          className={styles.backButton}
                          onClick={() => handleClose()}
                        >
                          Back
                        </div>
                      </div>
                    </div>
                  </Modal>
                )}
              </div>
            ))}
        </div>
        <Footer />
      </AppLayout>
    </>
  );
});
