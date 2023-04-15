import { mockRepositories } from "@/mock/mockRepositories";
import { mockTeams } from "@/mock/mockTeams";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "../styles/components/SideBar.module.scss";
import { InputSearch } from "./InputSearch";

export const SideBar = React.memo(() => {
  return (
    <div className={styles.container}>
      <div className={styles.profileNameWrapper}>
        <div className={styles.contentWrap}>
          <Image
            src={"/logo.png"}
            width={20}
            height={20}
            alt="profile画像"
            className={styles.avatar}
          />
          <span className={styles.profileName}>motokikonnno</span>
        </div>
      </div>
      <div>
        <div className={styles.sectionTitleContainer}>
          <h2 className={styles.sectionTitle}>Top Repositories</h2>
          <Link href={"/repository/new"}>
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
        <div className={styles.inputSearchWrapper}>
          <InputSearch
            placeholder={"Find a repository..."}
            backgroundColor={"#f6f8fa"}
            color={"#656d76"}
            borderColor={"#d0d7de"}
          />
        </div>
        {mockRepositories.map((mockRepository, index) => (
          <div key={index} className={styles.itemList}>
            <div className={styles.avatarWrapper}>
              <Image
                src={mockRepository.image}
                width={20}
                height={20}
                alt="profile画像"
                className={styles.avatar}
              />
            </div>
            <div className={styles.breakWord}>
              <Link className={styles.itemName} href="/">
                {mockRepository.name}
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div>
        <h2 className={styles.sectionTitle}>Your teams</h2>
        <div className={styles.inputSearchWrapper}>
          <InputSearch
            placeholder={"Find a team..."}
            backgroundColor={"#f6f8fa"}
            color={"#656d76"}
            borderColor={"#d0d7de"}
          />
        </div>
        {mockTeams.map((mockTeam, index) => (
          <div key={index} className={styles.itemList}>
            <Image
              src={mockTeam.image}
              width={20}
              height={20}
              alt="profile画像"
              className={styles.avatar}
            />
            <span className={styles.itemName}>{mockTeam.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
