import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import styles from "../../styles/components/pages/TeamProfile.module.scss";
import { Header } from "../layouts/Header";
import { Tabs } from "../Tabs";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "../layouts/Footer";
import { useRouter } from "next/router";
import { RepositoryCard } from "../card/RepositoryCard";
import { itemType } from "./UserProfile";
import { RepositoryList } from "../list/RepositoryList";
import { InputSearch } from "../InputSearch";
import { PeopleList } from "../list/PeopleLIst";
import { handleDeleteImage, onUploadToFireStorage } from "@/lib/storageUpload";
import { Team, teamFactory } from "@/models/Team";
import { useForm } from "react-hook-form";
import { Repository, repositoryFactory } from "@/models/Repository";
import { Modal } from "../Modal";
import { inviteFactory } from "@/models/Invite";
import { Count } from "@/models/Count";
import { PercentageBar } from "../PercentageBar";
import { UserBelongsToTeam } from "@/models/User";
import { teamMemberFactory } from "@/models/TeamMember";
import { SEO } from "../SEO";

export type TeamProfileProps = {
  teamData: Team;
  isSessionUser: boolean;
  items: itemType[];
  sessionUserName?: string | null;
  count: Count;
  repositories: { repositories: Repository[]; totalNumber: number };
  members: { members: UserBelongsToTeam[]; membersNumber: number };
};

type editTeamRepositoryType = {
  name: string;
  bio: string;
};

export const TeamProfile: FC<TeamProfileProps> = React.memo(
  ({
    teamData,
    isSessionUser,
    items,
    sessionUserName,
    count,
    repositories,
    members,
  }) => {
    const router = useRouter();
    const query = String(router.query.tab);
    const defaultImage =
      "https://firebasestorage.googleapis.com/v0/b/fithub-a295f.appspot.com/o/default%2Fif2dmi1ea10tfgha.png?alt=media&token=6b1fa117-48f3-4858-9383-7b86e70685b0";
    const [currentTab, setCurrentTab] = useState("Overview");
    const [isToggle, setIsToggle] = useState(false);
    const [team, setTeam] = useState(teamData);
    const [deleteFile, setDeleteFile] = useState<string[]>(
      team.image &&
        !team.image.includes("lh3.googleusercontent.com") &&
        !team.image.includes("avatars.githubusercontent.com")
        ? [team.image]
        : []
    );
    const [currentFile, setCurrentFile] = useState<string>(
      team.image ? team.image : defaultImage
    );
    const [isLoading, setLoading] = useState(false);
    const [inputText, setInputText] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [repositoriesData, setRepositoriesData] = useState(repositories);
    const [teamMembers, setTeamMembers] = useState(members);
    const inputRef = useRef<HTMLInputElement>(null);
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<editTeamRepositoryType>({
      mode: "onChange",
      defaultValues: { name: team.name, bio: team.bio },
    });

    useEffect(() => {
      const handlePopstate = () => {
        if (deleteFile) handleDeleteImage(deleteFile, currentFile);
        router.back();
      };
      history.pushState(null, "", null);
      window.addEventListener("popstate", handlePopstate, false);
      return () => {
        removeEventListener("popstate", handlePopstate, false);
      };
    }, [currentFile, deleteFile, router]);

    useEffect(() => {
      const switchCurrentTab = (query: string) => {
        switch (query) {
          case "Repositories":
            return setCurrentTab("Repositories");
          case "People":
            return setCurrentTab("People");
          case "Invite":
            return setCurrentTab("Invite");
          default:
            return setCurrentTab("Overview");
        }
      };
      switchCurrentTab(query);
    }, [query]);

    const handleCurrentTab = useCallback(
      (name: string) => {
        setCurrentTab(name);
        router.push(
          `/team/${team.id}/${name === "Overview" ? "" : `?tab=${name}`}`
        );
        if (isSearch) {
          setIsSearch(false);
        }
        setSearchText("");
      },
      [isSearch, router, team.id]
    );

    const handleIsToggle = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      e.preventDefault();
      if (team.image) setCurrentFile(team.image);
      setIsToggle(!isToggle);
      reset();
    };

    const handleLoadingFile = (flag: boolean) => {
      setLoading(flag);
    };

    const handleSetFile = (deleteFile: string[], url: string) => {
      setDeleteFile(deleteFile);
      setCurrentFile(url);
    };

    const clickHiddenInput = () => {
      if (inputRef.current === null) return;
      inputRef.current.click();
    };

    const onSubmit = async (data: editTeamRepositoryType) => {
      const updateTeam = await teamFactory().update({
        id: team.id,
        image: currentFile,
        ...data,
      });
      setTeam(updateTeam);
      handleDeleteImage(deleteFile, currentFile);
      setIsToggle(false);
    };

    const handleSendEmail = async () => {
      if (inputText === "") return;
      if (sessionUserName)
        await inviteFactory().create({
          invitee_email: inputText,
          inviter_name: sessionUserName,
          team_id: teamData.id,
        });
      setInputText("");
      setIsVisible(true);
    };

    const handleClose = () => {
      setIsVisible(!isVisible);
    };

    const submitInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSendEmail();
      }
    };

    const handleChangeSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    };

    const submitSearchRepositories = async () => {
      if (searchText === "") {
        setRepositoriesData(repositories);
        setIsSearch(false);
      } else {
        const result = await repositoryFactory().index({
          queries: {
            owner_id: teamData.id,
            isPrivate: isSessionUser,
            type: "team",
            search: searchText,
          },
        });
        setRepositoriesData(result);
        setIsSearch(true);
      }
    };

    const submitSearchMembers = async () => {
      if (searchText === "") {
        setTeamMembers(members);
      } else {
        const result = await teamMemberFactory().index({
          queries: {
            team_id: teamData.id,
            search: searchText,
          },
        });
        setTeamMembers(result);
      }
    };

    return (
      <>
        <SEO title={team.name} url={router.asPath} />
        <Header />
        <div className={styles.backgroundColor}>
          <div className={styles.teamDetailContainer}>
            {team.image && (
              <Image
                src={team.image}
                width={50}
                height={50}
                alt="team-icon"
                className={styles.teamIconHeader}
              />
            )}
            <span className={styles.teamNameHeader}>{teamData.name}</span>
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
        <div
          className={
            currentTab === "Overview"
              ? styles.layoutContainer
              : styles.tabRepositoryContainer
          }
        >
          {currentTab === "Overview" && (
            <>
              <SEO title={teamData.name} url={router.asPath} />
              <div className={styles.leftContainer}>
                <div className={styles.teamIcon}>
                  <Image
                    src={currentFile}
                    width={296}
                    height={296}
                    alt="team-icon"
                    className={styles.icon}
                  />
                  {isToggle && (
                    <>
                      <Image
                        src={"/icons/edit.svg"}
                        width={25}
                        height={25}
                        alt="edit-icon"
                        className={styles.editIcon}
                        onClick={clickHiddenInput}
                      />
                      <input
                        type={"file"}
                        hidden
                        accept=".png, .jpeg, .jpg"
                        onChange={(e) =>
                          onUploadToFireStorage(
                            e,
                            "user",
                            deleteFile,
                            handleLoadingFile,
                            handleSetFile
                          )
                        }
                        ref={inputRef}
                      />
                    </>
                  )}
                </div>
                {!isToggle && (
                  <>
                    <h1 className={styles.teamName}>{team.name}</h1>
                    <div className={styles.teamBio}>{team.bio}</div>
                    {isSessionUser && (
                      <div
                        className={styles.editButton}
                        onClick={handleIsToggle}
                      >
                        Edit profile
                      </div>
                    )}
                  </>
                )}
                {isToggle && (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.inputContainer}>
                      <label className={styles.label}>Name</label>
                      <input
                        className={styles.inputForm}
                        {...register("name", {
                          required: "※ Name is required",
                          maxLength: {
                            value: 50,
                            message: "Please enter within 50 characters",
                          },
                        })}
                      />
                      <p className={styles.errorMessage}>
                        {errors.name?.message}
                      </p>
                    </div>
                    <div className={styles.inputContainer}>
                      <label className={styles.label}>Bio</label>
                      <input
                        className={styles.inputForm}
                        {...register("bio")}
                      />
                    </div>
                    <div className={styles.updateButtonContainer}>
                      <button className={styles.updateButton} type="submit">
                        Save
                      </button>
                      <button
                        className={styles.cancelButton}
                        onClick={handleIsToggle}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
                <h2 className={styles.profileSection}>Members</h2>
                <div className={styles.memberIconContainer}>
                  {team.team_members &&
                    team.team_members.map(
                      ({ user }, index) =>
                        user.image && (
                          <Link href={`/user/${user.id}`} key={index}>
                            <Image
                              src={user.image}
                              width={32}
                              height={32}
                              className={styles.memberIcon}
                              alt="member-icon"
                            />
                          </Link>
                        )
                    )}
                </div>
              </div>
              {team.repositories && (
                <Overview
                  repositories={repositories.repositories}
                  count={count}
                  team={teamData}
                />
              )}
            </>
          )}
          {currentTab === "Repositories" && team.repositories && (
            <RepositoryList
              repositories={repositoriesData}
              owner={team}
              type={"team"}
              isSessionUser={isSessionUser}
              isSearch={isSearch}
              searchText={searchText}
              handleChangeSearchText={handleChangeSearchText}
              onSubmit={submitSearchRepositories}
              isValidating={false}
            />
          )}
          {currentTab === "People" && (
            <div className={styles.tabPeopleContainer}>
              <div className={styles.actionContainer}>
                <div className={styles.inputSearchContainer}>
                  <InputSearch
                    placeholder={"Find a member..."}
                    backgroundColor={"#fff"}
                    color={"#656d76"}
                    borderColor={"#d0d7de"}
                    searchText={searchText}
                    handleChangeSearchText={handleChangeSearchText}
                    onSubmit={submitSearchMembers}
                  />
                </div>
                {isSessionUser && (
                  <Link href={`/team/${team.id}?tab=Invite`}>
                    <button className={styles.inviteButton}>Invite</button>
                  </Link>
                )}
              </div>
              <div className={styles.peopleListWrapper}>
                <div
                  className={styles.peopleNumber}
                >{`${teamMembers.membersNumber} people`}</div>
                {teamMembers.members &&
                  teamMembers.members.map((member, index) => (
                    <PeopleList
                      people={member}
                      index={index}
                      peoples={teamMembers.membersNumber}
                      key={index}
                    />
                  ))}
              </div>
            </div>
          )}
          {currentTab === "Invite" && (
            <div className={styles.tabPeopleContainer}>
              <h2 className={styles.inviteTitle}>Send invite email</h2>
              <div className={styles.inviteContainer}>
                <input
                  type={"text"}
                  className={styles.inviteForm}
                  placeholder="send email"
                  value={inputText}
                  onKeyDown={(e) => submitInputEnter(e)}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button onClick={handleSendEmail} className={styles.sendButton}>
                  send
                </button>
              </div>
              {isVisible && (
                <Modal isVisible={isVisible} handleClose={handleClose}>
                  <div className={styles.confirmModalBackground}>
                    <p className={styles.confirmText}>
                      Email has been successfully sent!
                    </p>
                    <div className={styles.confirmContainer}>
                      <div
                        className={styles.confirmButton}
                        onClick={() => handleClose()}
                      >
                        OK
                      </div>
                    </div>
                  </div>
                </Modal>
              )}
            </div>
          )}
        </div>
        <Footer />
      </>
    );
  }
);

type OverviewProps = {
  repositories: Repository[];
  count: Count;
  team: Team;
};

const Overview: FC<OverviewProps> = ({ repositories, count, team }) => {
  return (
    <div className={styles.rightContainer}>
      {repositories.length !== 0 && (
        <h2 className={styles.title}>Recent repositories</h2>
      )}
      <div className={styles.repositoriesContainer}>
        {repositories.map((repository, index) => (
          <RepositoryCard
            index={index}
            repository={repository}
            key={index}
            type={"team"}
          />
        ))}
      </div>
      {count && Object.keys(count).length !== 0 && (
        <section className={styles.percentages}>
          <h2 className={styles.sectionTitle}>Body parts percentages</h2>
          <div className={styles.percentageBarWrapper}>
            <PercentageBar count={count} />
          </div>
        </section>
      )}
      <h2 className={styles.title}>Contributions</h2>
      <div className={styles.commitNumber}>{team.commits?.length}</div>
    </div>
  );
};
