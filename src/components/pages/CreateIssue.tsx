import useFetchUser from "@/hooks/useFetchUser";
import { Repository } from "@/models/Repository";
import { Team } from "@/models/Team";
import { UserBelongsToTeam } from "@/models/User";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useCallback, useState } from "react";
import styles from "../../styles/components/pages/CreateIssue.module.scss";
import { Footer } from "../layouts/Footer";
import { Header } from "../layouts/Header";
import { Tabs } from "../Tabs";
import { Tiptap } from "../Tiptap";
import { items } from "./IssueDetail";

export type CreateIssueProps = {
  repository: Repository;
  owner: UserBelongsToTeam | Team;
  type: "user" | "team";
};

export const CreateIssue: FC<CreateIssueProps> = React.memo(
  ({ repository, owner, type }) => {
    const router = useRouter();
    const { data: session } = useSession();
    const { user } = useFetchUser(session?.user ? session.user.id : null);
    const [currentTab, setCurrentTab] = useState("Issue");
    const [titleText, setTitleText] = useState("");

    const handleCurrentTab = useCallback(
      (name: string) => {
        setCurrentTab(name);
        router.push(
          type === "user"
            ? `/user/${owner.id}/repository/${repository.id}/${
                name === "Issue" ? "issue/new" : ""
              }`
            : `/team/${owner.id}/repository/${repository.id}/${
                name === "Issue" ? "issue/new" : ""
              }`
        );
      },
      [owner.id, repository.id, router, type]
    );

    const handleTitleText = () => {
      setTitleText("");
    };

    return (
      <>
        <Header />
        <div className={styles.backgroundColor}>
          <div className={styles.teamDetailContainer}>
            <Link
              href={type === "user" ? `/user/${owner.id}` : `/team/${owner.id}`}
              className={styles.teamNameHeader}
            >
              {owner.name}
            </Link>
            <span className={styles.sectionLine}>/</span>
            <Link
              href={
                type === "user"
                  ? `/user/${owner.id}/repository/${repository.id}`
                  : `/team/${owner.id}/repository/${repository.id}`
              }
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
            {user && type === "user" ? (
              <Tiptap
                type={"createIssue"}
                repository={repository}
                handleTitleText={handleTitleText}
                titleText={titleText}
                userId={user.id}
              />
            ) : (
              user && (
                <Tiptap
                  type={"createIssue"}
                  repository={repository}
                  handleTitleText={handleTitleText}
                  titleText={titleText}
                  userId={user.id}
                  teamId={owner.id}
                />
              )
            )}
          </div>
        </div>
        <Footer />
      </>
    );
  }
);
