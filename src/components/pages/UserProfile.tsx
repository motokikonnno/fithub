import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import styles from "../../styles/components/pages/UserProfile.module.scss";
import { Header } from "../layouts/Header";
import { Tabs } from "../Tabs";
import Image from "next/image";
import { mockTeams } from "@/mock/mockTeams";
import Link from "next/link";
import ReactCalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Footer } from "../layouts/Footer";
import { useRouter } from "next/router";
import { RepositoryCard } from "../card/RepositoryCard";
import { RepositoryList } from "../list/RepositoryList";
import { handleDeleteImage, onUploadToFireStorage } from "@/lib/storageUpload";
import { User, userFactory } from "@/models/User";
import { useForm } from "react-hook-form";
import { Repository } from "@/models/Repository";
import { useSession } from "next-auth/react";

export type itemType = {
  id: string;
  name: string;
};

type updateUserType = {
  name: string;
  bio: string;
  email: string;
};

// TODO: 保存せずに戻った場合にstorageから削除する処理を作成する

export type UserProfileProps = {
  userData: User;
};

export const UserProfile: FC<UserProfileProps> = React.memo(({ userData }) => {
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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<updateUserType>({
    mode: "onChange",
    defaultValues: { name: user.name, email: user.email, bio: user.bio },
  });
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
  const inputRef = useRef<HTMLInputElement>(null);

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
    },
    [router, user.id]
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
  };

  return (
    <>
      <Header image={user.image} />
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
        <div className={styles.leftContainer}>
          <div className={styles.userIcon}>
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
              <button
                className={styles.editButton}
                onClick={() => setIsToggle(true)}
              >
                Edit profile
              </button>
            </>
          )}
          {isToggle && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Name</label>
                <input
                  className={styles.inputForm}
                  {...register("name", { required: "※ Name is required" })}
                />
                <p className={styles.errorMessage}>{errors.name?.message}</p>
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Bio</label>
                <textarea className={styles.inputForm} {...register("bio")} />
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.label}>Email</label>
                <input
                  className={styles.inputForm}
                  {...register("email", { required: "Email is required" })}
                />
                <p className={styles.errorMessage}>{errors.email?.message}</p>
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
            {mockTeams.map(({ image }, index) => (
              <Link href={"/"} key={index}>
                <Image
                  src={image}
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
            <Overview repositories={userData.repositories} user={userData} />
          ) : (
            <div className={styles.repositoryComponentWrapper}>
              <RepositoryList repositories={userData.repositories} />
            </div>
          ))}
      </div>
      <Footer />
    </>
  );
});

export type ProfileProps = {
  repositories: Repository[];
  user: User;
};

const Overview: FC<ProfileProps> = ({ repositories, user }) => {
  const { data: session } = useSession();
  const sortRepositories = [...repositories].sort((a, b) => {
    return Number(b.created_at) - Number(a.created_at);
  });
  const publicRepositories = sortRepositories.slice(0, 6);
  const privateRepositories = sortRepositories
    .filter(({ is_private }) => is_private === 2)
    .slice(0, 6);
  return (
    <div className={styles.rightContainer}>
      <h2 className={styles.title}>Recent repositories</h2>
      <div className={styles.repositoriesContainer}>
        {session?.user.id === user.id
          ? publicRepositories.map((repository, index) => (
              <RepositoryCard
                index={index}
                repository={repository}
                key={index}
              />
            ))
          : privateRepositories.map((repository, index) => (
              <RepositoryCard
                index={index}
                repository={repository}
                key={index}
              />
            ))}
      </div>
      <h2 className={styles.title}>317 contributions</h2>
      <div className={styles.calendarContainer}>
        <ReactCalendarHeatmap
          startDate={new Date("2023-01-01")}
          endDate={new Date("2023-12-31")}
          values={[
            { date: "2023-05-22", count: 12 },
            { date: "2023-07-24", count: 12 },
            { date: "2023-11-10", count: 12 },
          ]}
        />
      </div>
    </div>
  );
};
