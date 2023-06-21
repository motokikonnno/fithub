import useFetchUser from "@/hooks/useFetchUser";
import { Repository } from "@/models/Repository";
import { Team } from "@/models/Team";
import { UserBelongsToTeam } from "@/models/User";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useState } from "react";
import styles from "../../styles/components/pages/CreateIssue.module.scss";
import { Footer } from "../layouts/Footer";
import { Header } from "../layouts/Header";
import { SEO } from "../SEO";
import { Tiptap } from "../Tiptap";
import { itemType } from "./UserProfile";

export type CreateIssueProps = {
  repository: Repository;
  owner: UserBelongsToTeam | Team;
  type: "user" | "team";
  items: itemType[];
};

export const CreateIssue: FC<CreateIssueProps> = React.memo(
  ({ repository, owner, type, items }) => {
    const router = useRouter();
    const { data: session } = useSession();
    const { user } = useFetchUser(session?.user ? session.user.id : null);
    const [titleText, setTitleText] = useState("");

    const handleTitleText = () => {
      setTitleText("");
    };

    return (
      <>
        <SEO title={"FitHub"} url={router.asPath} />
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
            {items.map((item, index) =>
              item.id === "1" ? (
                <Link
                  key={index}
                  href={`/${type}/[${
                    type === "team" ? "team_id" : "user_id"
                  }]/repository/[repository_id]`}
                  as={item.link}
                  className={styles.item}
                >
                  {item.name}
                </Link>
              ) : (
                <div key={index} className={`${styles.current} ${styles.item}`}>
                  {item.name}
                </div>
              )
            )}
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
