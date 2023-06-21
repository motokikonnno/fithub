import { UserBelongsToTeam } from "@/models/User";
import { shapeOwnerDataWithRepositories } from "@/services/ownerList";
import { recentSortRepositories } from "@/services/recentSortRepositories";
import { OwnerWithRepositories } from "@/types/owner";
import Image from "next/image";
import Link from "next/link";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import styles from "../../styles/components/layouts/SideBar.module.scss";

type SideBarProps = {
  user: UserBelongsToTeam;
};

export const SideBar: FC<SideBarProps> = React.memo(({ user }) => {
  const ownerList: {
    owners: OwnerWithRepositories[];
    ownerData: OwnerWithRepositories;
  } = useMemo(() => {
    const userData = shapeOwnerDataWithRepositories(user).userData;
    const teamList = shapeOwnerDataWithRepositories(user).teamData;
    return { owners: [userData, ...teamList], ownerData: userData };
  }, [user]);
  const [toggleOwnerList, setToggleOwnerList] = useState(false);
  const [owner, setOwner] = useState<OwnerWithRepositories>(
    ownerList.ownerData
  );
  const [type, setType] = useState<"user" | "team">("user");
  const sortRepositories =
    owner.repositories && recentSortRepositories(owner.repositories);
  const recentRepositories = sortRepositories?.slice(0, 7);
  const [currentRepositories, setCurrentRepositories] =
    useState(recentRepositories);
  const [currentOwnerList, setCurrentOwnerList] = useState(ownerList.owners);
  const defaultImage =
    "https://firebasestorage.googleapis.com/v0/b/fithub-a295f.appspot.com/o/default%2Fif2dmi1ea10tfgha.png?alt=media&token=6b1fa117-48f3-4858-9383-7b86e70685b0";
  const dropDownListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ownerArray: OwnerWithRepositories[] = ownerList.owners.filter(
      ({ id }) => id !== owner.id
    );
    setCurrentOwnerList(ownerArray);
  }, [owner.id, ownerList]);

  useEffect(() => {
    const handleClickToCloseDropDown = (event: MouseEvent) => {
      if (!(event.target instanceof HTMLElement)) {
        return;
      }
      const element = dropDownListRef.current;

      if (element && element?.contains(event.target)) return;
      setToggleOwnerList(false);
    };
    window.addEventListener("click", handleClickToCloseDropDown, true);
    return () => {
      window.removeEventListener("click", handleClickToCloseDropDown);
    };
  }, []);

  const handleSetOwner = (owner: OwnerWithRepositories) => {
    setOwner(owner);
    setToggleOwnerList(false);
    setType(owner.type);
    setCurrentRepositories(owner.repositories);
  };
  return (
    <div className={styles.container}>
      <div className={styles.profileNameWrapper} ref={dropDownListRef}>
        <div
          className={styles.contentWrap}
          onClick={() => setToggleOwnerList(!toggleOwnerList)}
        >
          {owner.image ? (
            <Image
              src={owner.image}
              width={20}
              height={20}
              alt="profile画像"
              className={styles.avatar}
            />
          ) : (
            <Image
              src={defaultImage}
              width={20}
              height={20}
              alt="profile画像"
              className={styles.avatar}
            />
          )}

          <span className={styles.profileName}>{owner.name}</span>
        </div>
        {toggleOwnerList && (
          <ul className={styles.listWrapper}>
            {currentOwnerList.map(
              (owner, index) =>
                owner.image && (
                  <li
                    onClick={() => handleSetOwner(owner)}
                    key={index}
                    className={styles.listItem}
                  >
                    <Image
                      src={owner.image}
                      width={16}
                      height={16}
                      alt="owner-icon"
                      className={styles.avatar}
                    />
                    {owner.name}
                  </li>
                )
            )}
          </ul>
        )}
      </div>
      <div className={styles.sectionWrapper}>
        <div className={styles.sectionTitleContainer}>
          <h2 className={styles.sectionTitle}>Top Repositories</h2>
          <Link
            href={
              type === "user"
                ? {
                    pathname: `/repository/new`,
                    query: { type: type },
                  }
                : {
                    pathname: `/repository/new`,
                    query: { type: type, team_id: owner.id },
                  }
            }
            className={styles.link}
          >
            <div className={styles.newRepositoryButton}>
              <Image
                src={"/icons/add-repository.svg"}
                width={13}
                height={13}
                alt="repositoryアイコン"
                className={styles.repositoryIcon}
              />
              New
            </div>
          </Link>
        </div>
        {currentRepositories &&
          currentRepositories.map((repository, index) => (
            <div key={index} className={styles.itemList}>
              <div className={styles.avatarWrapper}>
                {owner.image ? (
                  <Image
                    src={owner.image}
                    width={20}
                    height={20}
                    alt="profile画像"
                    className={styles.avatar}
                  />
                ) : (
                  <Image
                    src={defaultImage}
                    width={20}
                    height={20}
                    alt="profile画像"
                    className={styles.avatar}
                  />
                )}
              </div>
              <div className={styles.breakWord}>
                <Link
                  className={styles.itemName}
                  href={
                    type === "user"
                      ? `/user/${owner.id}/repository/${repository.id}`
                      : `/team/${owner.id}/repository/${repository.id}`
                  }
                >
                  {repository.name}
                </Link>
              </div>
            </div>
          ))}
      </div>
      <div className={styles.teamsWrapper}>
        <h2 className={styles.sectionTeamTitle}>Your teams</h2>
        {user.team_members &&
          user.team_members.map(({ team }, index) => (
            <div key={index} className={styles.itemList}>
              <Image
                src={team.image}
                width={20}
                height={20}
                alt="profile画像"
                className={styles.avatar}
              />
              <Link href={`/team/${team.id}`} className={styles.itemName}>
                {team.name}
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
});
