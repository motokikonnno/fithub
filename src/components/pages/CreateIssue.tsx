import { Repository } from "@/models/Repository";
import { Team } from "@/models/Team";
import { User } from "@/models/User";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "../../styles/components/pages/CreateIssue.module.scss";
import { Footer } from "../layouts/Footer";
import { Header } from "../layouts/Header";
import { Tabs } from "../Tabs";
import { Tiptap } from "../Tiptap";
import { items } from "./RepositoryDetail";

export type CreateIssueProps = {
  repository: Repository;
  owner: User | Team;
};

export const CreateIssue: FC<CreateIssueProps> = React.memo(
  ({ repository, owner }) => {
    const router = useRouter();
    const [currentTab, setCurrentTab] = useState("Issue");
    const [titleText, setTitleText] = useState("");

    const handleCurrentTab = useCallback(
      (name: string) => {
        setCurrentTab(name);
        router.push(
          `/user/${owner.id}/repository/${repository.id}/${
            name === "Issue" ? "issue/new" : ""
          }`
        );
      },
      [owner.id, repository.id, router]
    );

    const handleTitleText = () => {
      setTitleText("");
    };

    return (
      <>
        <Header />
        <div className={styles.backgroundColor}>
          <div className={styles.teamDetailContainer}>
            <Link href={`/user/${owner.id}`} className={styles.teamNameHeader}>
              {owner.name}
            </Link>
            <span className={styles.sectionLine}>/</span>
            <Link
              href={`/user/${owner.id}/repository/${repository.id}`}
              className={styles.teamNameHeader}
            >
              {repository.name}
            </Link>
          </div>
          <div className={styles.tabsContainer}>
            {items.map((item, index) => (
              <Tabs
                item={item}
                handleCurrentTab={handleCurrentTab}
                currentTab={currentTab}
                key={index}
              />
            ))}
          </div>
        </div>

        <div className={styles.createIssueContainer}>
          <h1 className={styles.title}>Create issue</h1>
          <div className={styles.inputWrapper}>
            <input
              placeholder="Title"
              type={"text"}
              className={styles.titleInput}
              onChange={(e) => setTitleText(e.target.value)}
            />
          </div>
          <div className={styles.tiptapWrapper}>
            <Tiptap
              type={"createIssue"}
              repository={repository}
              handleTitleText={handleTitleText}
              titleText={titleText}
              user={owner}
            />
          </div>
        </div>
        <Footer />
      </>
    );
  }
);
