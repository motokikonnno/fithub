import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import styles from "../../styles/components/pages/IssueDetail.module.scss";
import { Footer } from "../layouts/Footer";
import { Header } from "../layouts/Header";
import { Tabs } from "../Tabs";
import { Tiptap } from "../Tiptap";
import { Repository } from "@/models/Repository";
import { Issue, issueFactory } from "@/models/Issue";
import { formatDateToEnglish } from "../../utils/getTime";
import { useForm } from "react-hook-form";
import { Modal } from "../Modal";
import { Team } from "@/models/Team";
import { mentionFactory } from "@/models/Mention";
import { UserBelongsToTeam } from "@/models/User";
import { itemType } from "./UserProfile";

export type IssueDetailProps = {
  repository: Repository;
  team?: Team;
  issue: Issue;
  sessionUserId?: string;
};

export const items: itemType[] = [
  {
    id: "1",
    name: "Log",
  },
  {
    id: "2",
    name: "Issue",
  },
];

export const IssueDetail: FC<IssueDetailProps> = React.memo(
  ({ repository, team, issue, sessionUserId }) => {
    const router = useRouter();
    const created_at = formatDateToEnglish(issue.created_at);
    const [currentTab, setCurrentTab] = useState("Issue");
    const [assignUser, setAssignUser] = useState(
      issue.mention ? issue.mention.user : ""
    );
    const [toggleSelectUser, setToggleSelectUser] = useState(false);
    const [toggleEdit, setToggleEdit] = useState(false);
    const [issueTitle, setIssueTitle] = useState(issue.title);
    const [isVisible, setIsVisible] = useState(false);
    const [memberList, setMemberList] = useState(team?.team_members);
    const dropDownListRef = useRef<HTMLDivElement>(null);
    const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
      clearErrors,
    } = useForm<{ title: string }>({
      mode: "onChange",
      defaultValues: { title: issue.title },
    });

    useEffect(() => {
      if (team?.team_members && typeof assignUser !== "string") {
        const filterOwnerList = team.team_members.filter(({ user }) => {
          user.id !== assignUser.id;
        });
        setMemberList(filterOwnerList);
      }
    }, [assignUser, team?.team_members]);

    useEffect(() => {
      const handleClickToCloseDropDown = (event: MouseEvent) => {
        if (!(event.target instanceof HTMLElement)) {
          return;
        }
        const element = dropDownListRef.current;

        if (element && element?.contains(event.target)) return;
        setToggleSelectUser(false);
      };
      window.addEventListener("click", handleClickToCloseDropDown, true);
      return () => {
        window.removeEventListener("click", handleClickToCloseDropDown);
      };
    }, []);

    const handleCurrentTab = useCallback(
      (name: string) => {
        setCurrentTab(name);
        router.push(
          team
            ? `/team/${team.id}/repository/${repository.id}/${
                name === "Issue" ? `issue/${issue.id}` : ""
              }`
            : `/user/${issue.user.id}/repository/${repository.id}/${
                name === "Issue" ? `issue/${issue.id}` : ""
              }`
        );
      },
      [issue.id, issue.user.id, repository.id, router, team]
    );

    const handleAssignUser = (user: UserBelongsToTeam) => {
      setAssignUser(user);
      setToggleSelectUser(false);
    };

    const handleCancel = () => {
      setToggleEdit(false);
      setValue("title", issue.title);
      clearErrors("title");
    };

    const onSubmit = async (data: { title: string }) => {
      await issueFactory().update({
        id: issue.id,
        title: data.title,
      });
      const newIssue = await issueFactory().show(String(issue.id));
      setToggleEdit(!toggleEdit);
      setIssueTitle(newIssue.title);
    };

    const handleClose = () => {
      setIsVisible(!isVisible);
    };

    const handleDeleteIssue = async () => {
      await issueFactory().delete(String(issue.id));
      router.push(
        team
          ? `/team/${team.id}/repository/${repository.id}?tab=Issue`
          : `/user/${issue.user.id}/repository/${repository.id}?tab=Issue`
      );
    };

    const handleCreateMention = async (user: UserBelongsToTeam) => {
      if (sessionUserId && user.id) {
        await mentionFactory().update({
          mentioned_user_id: user.id,
          mentioner_id: sessionUserId,
          issue_id: issue.id,
        });
      }
    };

    return (
      <>
        <Header />
        <div className={styles.backgroundColor}>
          <div className={styles.teamDetailContainer}>
            <Link
              href={team ? `/team/${team.id}` : `/user/${issue.user.id}`}
              className={styles.teamNameHeader}
            >
              {team ? team.name : issue.user.name}
            </Link>
            <span className={styles.sectionLine}>/</span>
            <Link
              href={`/user/${issue.user.id}/repository/${repository.id}`}
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
        <div className={styles.layoutContainer}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.titleContainer}>
              {toggleEdit ? (
                <>
                  <input
                    type={"text"}
                    className={styles.titleEdit}
                    {...register("title", { required: "※ Title is required" })}
                  />
                  <div className={styles.actionButtonContainer}>
                    <button className={styles.saveButton} type="submit">
                      Save
                    </button>
                    <span
                      className={styles.cancelButton}
                      onClick={handleCancel}
                    >
                      Cancel
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <h1 className={styles.title}>
                    {issueTitle}
                    <span className={styles.issueNumber}>
                      #{issue.issue_number}
                    </span>
                  </h1>
                  <div className={styles.actionButtonContainer}>
                    <span
                      className={styles.editButton}
                      onClick={() => setToggleEdit(!toggleEdit)}
                    >
                      Edit
                    </span>
                    <Link
                      href={
                        team
                          ? `/team/${issue.user.id}/repository/${repository.id}/issue/new`
                          : `/user/${issue.user.id}/repository/${repository.id}/issue/new`
                      }
                      className={styles.newIssueButton}
                    >
                      New issue
                    </Link>
                  </div>
                </>
              )}
            </div>
          </form>
          {toggleEdit && (
            <p className={styles.errorMessage}>{errors.title?.message}</p>
          )}

          <div className={styles.issueDetailContainer}>
            <div
              className={`${styles.issueTypeContainer} ${
                issue.type === "Done" ? styles.purple : styles.green
              }`}
            >
              <Image
                src={
                  issue.type === "Done"
                    ? "/icons/circle-check-white.svg"
                    : "/icons/circle-dot-white.svg"
                }
                width={16}
                height={16}
                alt="issue-type-icon"
              />
              <span className={styles.issueType}>{issue.type}</span>
            </div>
            <Link
              href={`/user/${issue.user.id}`}
              className={styles.createdUser}
            >
              {issue.user.name}
            </Link>
            <span className={styles.createdAt}>
              opened this issue on {created_at}
            </span>
          </div>
          <div className={styles.tiptapContainer}>
            {team && typeof assignUser === "string" ? (
              <div className={styles.assignUser}>no assigned</div>
            ) : (
              <div className={styles.assignUser}>
                <span className={styles.assignUserName}>
                  {typeof assignUser !== "string" && assignUser.name}
                </span>
                {typeof assignUser !== "string" && "is assigned"}
              </div>
            )}

            <Tiptap
              text={issue.issue}
              type={"issue"}
              repository={repository}
              issueId={issue.id}
            />
          </div>
          <div className={styles.selectNameContainer}>
            <div className={styles.leftContainer}>
              <div
                className={styles.selectName}
                onClick={() => setToggleSelectUser(!toggleSelectUser)}
              >
                <>
                  {typeof assignUser !== "string" && assignUser.image && (
                    <Image
                      src={assignUser.image}
                      width={16}
                      height={16}
                      alt="user-icon"
                      className={styles.memberIcon}
                    />
                  )}
                  {assignUser === ""
                    ? "Select user"
                    : typeof assignUser !== "string" && assignUser.name}
                </>
              </div>
              <div
                className={styles.assignButton}
                onClick={() =>
                  typeof assignUser !== "string" &&
                  handleCreateMention(assignUser)
                }
              >
                Assign user
              </div>
            </div>
            <button className={styles.deleteIssueButton} onClick={handleClose}>
              Delete issue
            </button>
            {isVisible && (
              <Modal isVisible={isVisible} handleClose={handleClose}>
                <div className={styles.confirmModalBackground}>
                  <p className={styles.confirmText}>
                    Do you really want to delete this?
                  </p>
                  <div className={styles.confirmContainer}>
                    <div
                      className={styles.deleteButton}
                      onClick={handleDeleteIssue}
                    >
                      Delete
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
          {toggleSelectUser && (
            <div className={styles.memberNameWrapper} ref={dropDownListRef}>
              {memberList &&
                memberList.map(
                  ({ user }, index) =>
                    user.image && (
                      <div
                        className={styles.memberName}
                        onClick={() => handleAssignUser(user)}
                        key={index}
                      >
                        <Image
                          src={user.image}
                          width={16}
                          height={16}
                          alt="member-icon"
                          className={styles.memberIcon}
                        />
                        {user.name}
                      </div>
                    )
                )}
            </div>
          )}
        </div>
        <Footer />
      </>
    );
  }
);
