import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useCallback, useState } from "react";
import styles from "../../styles/components/pages/IssueDetail.module.scss";
import { Footer } from "../layouts/Footer";
import { Header } from "../layouts/Header";
import { Tabs } from "../Tabs";
import { Tiptap } from "../Tiptap";
import { items } from "./RepositoryDetail";
import { Repository } from "@/models/Repository";
import { User } from "@/models/User";
import { Issue, issueFactory } from "@/models/Issue";
import { formatDateToEnglish } from "../../utils/getTime";
import { useForm } from "react-hook-form";
import { Modal } from "../Modal";

export type IssueDetailProps = {
  repository: Repository;
  user: User;
  issue: Issue;
};

export const IssueDetail: FC<IssueDetailProps> = React.memo(
  ({ repository, user, issue }) => {
    const created_at = formatDateToEnglish(issue.created_at);
    const issueData = {
      id: "1",
      title: "記事が投稿されたら通知がいくようにする",
      createdAt: "July 11",
      createdUser: "motoki",
      type: "To do",
      assignUser: "satoshi",
      icon: "/example.png",
    };

    const teamMember = [
      {
        name: "スダリオ",
        icon: "/example.png",
      },
      {
        name: "hit",
        icon: "/example.png",
      },
      {
        name: "猗窩座",
        icon: "/example.png",
      },
      {
        name: "海",
        icon: "/example.png",
      },
    ];

    const router = useRouter();
    const [currentTab, setCurrentTab] = useState("Issue");
    const [assignUser, setAssignUser] = useState(user.name);
    const [toggleSelectUser, setToggleSelectUser] = useState(false);
    const [toggleEdit, setToggleEdit] = useState(false);
    const [issueTitle, setIssueTitle] = useState(issue.title);
    const [isVisible, setIsVisible] = useState(false);
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

    const handleCurrentTab = useCallback(
      (name: string) => {
        setCurrentTab(name);
        router.push(
          `/user/${user.id}/repository/${repository.id}/${
            name === "Issue" ? `issue/${issue.id}` : ""
          }`
        );
      },
      [issue.id, repository.id, router, user.id]
    );

    const handleAssignUser = (name: string) => {
      setAssignUser(name);
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
      router.push(`/user/${user.id}/repository/${repository.id}?tab=Issue`);
    };

    return (
      <>
        <Header />
        <div className={styles.backgroundColor}>
          <div className={styles.teamDetailContainer}>
            <Link href={`/user/${user.id}`} className={styles.teamNameHeader}>
              {user.name}
            </Link>
            <span className={styles.sectionLine}>/</span>
            <Link
              href={`/user/${user.id}/repository/${repository.id}`}
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
                    <span className={styles.issueNumber}>#{issue.id}</span>
                  </h1>
                  <div className={styles.actionButtonContainer}>
                    <span
                      className={styles.editButton}
                      onClick={() => setToggleEdit(!toggleEdit)}
                    >
                      Edit
                    </span>
                    <Link
                      href={`/user/${user.id}/repository/${repository.id}/issue/new`}
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
              <span className={styles.issueType}>{issueData.type}</span>
            </div>
            <Link href={`/user/${user.id}`} className={styles.createdUser}>
              {user.name}
            </Link>
            <span className={styles.createdAt}>
              opened this issue on {created_at}
            </span>
          </div>
          <div className={styles.tiptapContainer}>
            {issueData.assignUser === "" ? (
              <div className={styles.assignUser}>no assigned</div>
            ) : (
              <div className={styles.assignUser}>
                <span className={styles.assignUserName}>{assignUser}</span>
                is assigned
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
                <Image
                  src={issueData.icon}
                  width={16}
                  height={16}
                  alt="user-icon"
                  className={styles.memberIcon}
                />
                {assignUser === "" ? "Select user" : assignUser}
              </div>
              <div className={styles.assignButton}>Assign user</div>
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
            <div className={styles.memberNameWrapper}>
              {teamMember.map((member, index) => (
                <div
                  className={styles.memberName}
                  onClick={() => handleAssignUser(member.name)}
                  key={index}
                >
                  <Image
                    src={member.icon}
                    width={16}
                    height={16}
                    alt="member-icon"
                    className={styles.memberIcon}
                  />
                  {member.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </>
    );
  }
);
