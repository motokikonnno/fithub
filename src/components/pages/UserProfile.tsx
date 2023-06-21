import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import styles from "../../styles/components/pages/UserProfile.module.scss";
import { Header } from "../layouts/Header";
import { Tabs } from "../Tabs";
import Image from "next/image";
import Link from "next/link";
import ReactCalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Footer } from "../layouts/Footer";
import { useRouter } from "next/router";
import { RepositoryCard } from "../card/RepositoryCard";
import { RepositoryList } from "../list/RepositoryList";
import { handleDeleteImage, onUploadToFireStorage } from "@/lib/storageUpload";
import { User, UserBelongsToTeam, userFactory } from "@/models/User";
import { useForm } from "react-hook-form";
import { Repository, repositoryFactory } from "@/models/Repository";
import { PercentageBar } from "../PercentageBar";
import { Count } from "@/models/Count";
import { Tooltip } from "react-tooltip";
import { Calender } from "@/models/Calender";
import { formatMonthEnglish } from "@/utils/getTime";
import { SEO } from "../SEO";

export type itemType = {
  id: string;
  name: string;
  link?: string;
};

type updateUserType = {
  name: string;
  bio: string;
};

export type UserProfileProps = {
  userData: UserBelongsToTeam;
  isSessionUser: boolean;
  count: Count;
  repositories: { repositories: Repository[]; totalNumber: number };
  calender: Calender[];
};

export const UserProfile: FC<UserProfileProps> = React.memo(
  ({ userData, isSessionUser, count, repositories, calender }) => {
    const items: itemType[] = [
      {
        id: "1",
        name: "Overview",
      },
      {
        id: "2",
        name: "Repositories",
      },
    ];

    const router = useRouter();
    const query = router.query.tab;
    const [user, setUser] = useState<User>(userData);
    const defaultImage =
      "https://firebasestorage.googleapis.com/v0/b/fithub-a295f.appspot.com/o/default%2Fif2dmi1ea10tfgha.png?alt=media&token=6b1fa117-48f3-4858-9383-7b86e70685b0";
    const [currentTab, setCurrentTab] = useState("Overview");
    const [isToggle, setIsToggle] = useState(false);
    const [deleteFile, setDeleteFile] = useState<string[]>(
      user.image &&
        !user.image.includes("lh3.googleusercontent.com") &&
        !user.image.includes("avatars.githubusercontent.com")
        ? [user.image]
        : []
    );
    const [currentFile, setCurrentFile] = useState<string>(
      user.image ? user.image : defaultImage
    );
    const [isLoading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [repositoriesData, setRepositoriesData] = useState(repositories);
    const [searchText, setSearchText] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<updateUserType>({
      mode: "onChange",
      defaultValues: { name: user.name, bio: user.bio },
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
      if (query === "Repositories") {
        setCurrentTab("Repositories");
      } else {
        setCurrentTab("Overview");
      }
    }, [query]);

    const handleCurrentTab = useCallback(
      (name: string) => {
        setCurrentTab(name);
        router.push(
          `/user/${user.id}/${name === "Repositories" ? `?tab=${name}` : ""}`
        );
        if (isSearch) {
          setIsSearch(false);
        }
        setSearchText("");
      },
      [isSearch, router, user.id]
    );

    const handleIsToggle = () => {
      setIsToggle(!isToggle);
      if (user.image) setCurrentFile(user.image);
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

    const onSubmit = async (data: updateUserType) => {
      const updateUser = await userFactory().update({
        id: user.id,
        image: currentFile,
        ...data,
      });
      setUser(updateUser);
      handleDeleteImage(deleteFile, currentFile);
      setIsToggle(false);
      setIsEdit(true);
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
            owner_id: userData.id,
            isPrivate: isSessionUser,
            type: "user",
            search: searchText,
          },
        });
        setRepositoriesData(result);
        setIsSearch(true);
      }
    };

    return (
      <>
        {userData.name && <SEO title={userData.name} url={router.asPath} />}
        <Header is_edit={isEdit} />
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
        <div className={styles.layoutContainer}>
          <div
            className={`${styles.leftContainer} ${
              currentTab === "Repositories" && styles.noneStyle
            }`}
          >
            <div
              className={
                currentTab === "Overview" ? styles.userIcon : styles.noneStyle
              }
            >
              {isLoading ? (
                <div className={styles.skeltonImage}></div>
              ) : (
                currentFile && (
                  <Image
                    src={currentFile}
                    width={296}
                    height={296}
                    alt="user-icon"
                    className={styles.icon}
                  />
                )
              )}
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
                  {deleteFile && (
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
                  )}
                </>
              )}
            </div>
            {!isToggle && (
              <>
                <h1 className={styles.userName}>{user.name}</h1>
                <div className={styles.userBio}>{user.bio}</div>
                {isSessionUser && (
                  <>
                    <div className={styles.userEmail}>{user.email}</div>
                    <button
                      className={styles.editButton}
                      onClick={() => setIsToggle(true)}
                    >
                      Edit profile
                    </button>
                  </>
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
                  <p className={styles.errorMessage}>{errors.name?.message}</p>
                </div>
                <div className={styles.inputContainer}>
                  <label className={styles.label}>Bio</label>
                  <textarea className={styles.inputForm} {...register("bio")} />
                </div>
                <div className={styles.updateButtonContainer}>
                  <button className={styles.updateButton} type="submit">
                    Save
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={handleIsToggle}
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
            <h2 className={styles.profileSection}>Teams</h2>
            <div className={styles.teamIconContainer}>
              {userData.team_members &&
                userData.team_members.map(({ team }, index) => (
                  <Link href={`/team/${team.id}`} key={index}>
                    <Image
                      src={team.image}
                      width={32}
                      height={32}
                      className={styles.teamIcon}
                      alt="team-icon"
                    />
                  </Link>
                ))}
            </div>
          </div>
          {userData.repositories &&
            (currentTab === "Overview" ? (
              <Overview
                repositories={repositories.repositories}
                user={userData}
                count={count}
                calender={calender}
              />
            ) : (
              <div className={styles.repositoryComponentWrapper}>
                <RepositoryList
                  repositories={repositoriesData}
                  owner={userData}
                  type={"user"}
                  isSessionUser={isSessionUser}
                  isSearch={isSearch}
                  searchText={searchText}
                  handleChangeSearchText={handleChangeSearchText}
                  onSubmit={submitSearchRepositories}
                />
              </div>
            ))}
        </div>
        <Footer />
      </>
    );
  }
);

type OverviewProps = {
  repositories: Repository[];
  user?: UserBelongsToTeam;
  count: Count;
  calender: Calender[];
};

const Overview: FC<OverviewProps> = ({
  repositories,
  user,
  count,
  calender,
}) => {
  const weekdays = ["Mon", "Wed", "Fri"];
  const currentYear = new Date().getFullYear();
  const [yearNumber, setYearNumber] = useState(currentYear);
  const currentMonth = new Date().getMonth() + 1;
  const [monthNumber, setMonthNumber] = useState(currentMonth);
  const endDay = monthNumber === 2 || 4 || 6 || 9 || 11 ? 30 : 31;
  const [endDayNumber, setEndDayNumber] = useState(endDay);

  useEffect(() => {
    const endDay = monthNumber === 2 || 4 || 6 || 9 || 11 ? 30 : 31;
    setEndDayNumber(endDay);
  }, [monthNumber, setMonthNumber]);

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
            type={"user"}
          />
        ))}
      </div>
      <h2 className={styles.title}>{user?.commits.length} contributions</h2>
      <div className={styles.yearContainer}>
        <Image
          src={`/icons/angle-right.svg`}
          width={18}
          height={18}
          alt="angle-left-icon"
          className={styles.angleLeftIcon}
          onClick={() => setYearNumber(yearNumber - 1)}
        />
        <time className={styles.currentYear}>{yearNumber}</time>
        <Image
          src={`/icons/angle-right.svg`}
          width={18}
          height={18}
          alt="angle-right-icon"
          onClick={() => setYearNumber(yearNumber + 1)}
          className={styles.angleRightIcon}
        />
      </div>
      <div className={styles.monthContainer}>
        <Image
          src={`/icons/angle-right.svg`}
          width={18}
          height={18}
          alt="angle-left-icon"
          className={styles.angleLeftIcon}
          onClick={() =>
            monthNumber === 1
              ? setMonthNumber(12)
              : setMonthNumber(monthNumber - 1)
          }
        />
        <time className={styles.currentYear}>
          {formatMonthEnglish(monthNumber)}
        </time>
        <Image
          src={`/icons/angle-right.svg`}
          width={18}
          height={18}
          alt="angle-right-icon"
          onClick={() =>
            monthNumber === 12
              ? setMonthNumber(1)
              : setMonthNumber(monthNumber + 1)
          }
          className={styles.angleRightIcon}
        />
      </div>
      <ul className={styles.weekdaysSp}>
        {weekdays.map((weekday, index) => (
          <li key={index}>{weekday}</li>
        ))}
      </ul>
      <div className={styles.calendarContainer}>
        <ul className={styles.weekdayContainer}>
          {weekdays.map((weekday, index) => (
            <li key={index} className={styles.weekday}>
              {weekday}
            </li>
          ))}
        </ul>
        <ReactCalendarHeatmap
          startDate={new Date(`${yearNumber}-01-01`)}
          endDate={new Date(`${yearNumber}-12-31`)}
          values={calender}
          tooltipDataAttrs={(value: Calender) => {
            if (!value || !value.date) {
              return null;
            }
            return {
              "data-tooltip-content": `${value.date} commit： ${value.commitNumber}`,
              "data-tooltip-id": "tooltip",
            };
          }}
          classForValue={(value) => {
            if (!value) {
              return "color-empty";
            }
            return `color-github-${value.count}`;
          }}
        />
      </div>
      <div className={styles.calendarContainerSp}>
        <ReactCalendarHeatmap
          startDate={new Date(`${yearNumber}-0${monthNumber}-01`)}
          endDate={new Date(`${yearNumber}-0${monthNumber}-${endDayNumber}`)}
          values={calender}
          horizontal={false}
          showMonthLabels={false}
          tooltipDataAttrs={(value: Calender) => {
            if (!value || !value.date) {
              return null;
            }
            return {
              "data-tooltip-content": `${value.date} commit： ${value.commitNumber}`,
              "data-tooltip-id": "tooltip",
            };
          }}
          classForValue={(value) => {
            if (!value) {
              return "color-empty";
            }
            return `color-github-${value.count}`;
          }}
        />
      </div>
      <Tooltip id="tooltip" />
      {count && Object.keys(count).length !== 0 && (
        <section className={styles.percentages}>
          <h2 className={styles.sectionTitle}>Body parts percentages</h2>
          <div className={styles.percentageBarWrapper}>
            <PercentageBar count={count} />
          </div>
        </section>
      )}
    </div>
  );
};
