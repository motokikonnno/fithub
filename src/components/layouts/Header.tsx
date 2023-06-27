import styles from "../../styles/components/layouts/Header.module.scss";
import Image from "next/image";
import { DropDownList } from "../list/DropDownList";
import React, { FC, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import useFetchUser from "@/hooks/useFetchUser";
import { Repository, repositoryFactory } from "@/models/Repository";
import { useRouter } from "next/router";

type HeaderProps = {
  is_edit?: boolean;
};

export const Header: FC<HeaderProps> = React.memo(({ is_edit }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isShow, setIsShow] = useState(false);
  const [isShowProfile, setIsShowProfile] = useState(false);
  const [isNav, setIsNav] = useState(false);
  const dropDownListRef = useRef<HTMLDivElement>(null);
  const profileDropDownListRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLLIElement>(null);
  const searchRef = useRef<HTMLUListElement>(null);
  const { user, userMutate } = useFetchUser(
    session?.user.id ? session.user.id : null
  );
  const [searchText, setSearchText] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [repositories, setRepositories] = useState<{
    repositories: Repository[];
    totalNumber: number;
  }>();

  const dropDownList = {
    newList: [
      { title: "New repository", link: "/repository/new" },
      { title: "New team", link: "/team/new" },
    ],
    myProfile: [
      { title: "Your profile", link: `/user/${user?.id}` },
      {
        title: "Your repositories",
        link: `/user/${user?.id}?tab=Repositories`,
      },
      { title: "Your teams", link: "/team" },
      { title: "Sign out", link: "/sign_in" },
    ],
  };

  const navigationSp = [
    { title: "New repository", link: "/repository/new" },
    { title: "New team", link: "/team/new" },
    { title: "Your profile", link: `/user/${user?.id}` },
    {
      title: "Your repositories",
      link: `/user/${user?.id}?tab=Repositories`,
    },
    { title: "Your teams", link: "/team" },
    { title: "Sign out", link: "/sign_in" },
  ];

  const toggleIsShow = () => {
    if (isShowProfile) {
      setIsShowProfile(!isShowProfile);
    }
    setIsShow(!isShow);
  };

  const toggleIsShowProfile = () => {
    if (isShow) {
      setIsShow(!isShow);
    }
    setIsShowProfile(!isShowProfile);
  };

  useEffect(() => {
    const handleClickToCloseDropDown = (event: MouseEvent) => {
      if (!(event.target instanceof HTMLElement)) {
        return;
      }
      const element = dropDownListRef.current;
      const profileElement = profileDropDownListRef.current;
      const navElement = navRef.current;
      const searchElement = searchRef.current;
      if (
        (element && element?.contains(event.target)) ||
        (navElement && navElement?.contains(event.target)) ||
        (searchElement && searchElement?.contains(event.target)) ||
        (profileElement && profileElement?.contains(event.target))
      )
        return;
      setIsShow(false);
      setIsShowProfile(false);
      setIsSearch(false);
      setIsNav(false);
    };
    window.addEventListener("click", handleClickToCloseDropDown, true);
    return () => {
      window.removeEventListener("click", handleClickToCloseDropDown);
    };
  }, []);

  useEffect(() => {
    if (is_edit) {
      userMutate();
    }
  }, [is_edit, userMutate]);

  useEffect(() => {
    if (router.query.search) {
      setSearchText(String(router.query.search));
    }
  }, [router.query.search]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isNav) {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "visible";
        document.documentElement.style.overflow = "visible";
      }
    }
  }, [isNav]);

  const handleChangeInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    if (e.target.value === "") {
      setIsSearch(false);
      return;
    } else {
      const repositoriesData = await repositoryFactory().index({
        queries: {
          isPrivate: true,
          type: "user",
          owner_id: user?.id ? user.id : "",
          search: e.target.value,
        },
      });
      setIsSearch(true);
      setRepositories(repositoriesData);
    }
  };

  const handleRouterPush = (repository_id: string) => {
    window.location.href = `/user/${user?.id}/repository/${repository_id}/?search=${searchText}`;
  };

  return (
    <header className={styles.container}>
      <div className={styles.leftContainer}>
        <Link href={"/"}>
          <Image
            src={"/logo.png"}
            width={32}
            height={32}
            alt={"ロゴ画像"}
            className={styles.logoIcon}
          />
        </Link>
        <div className={styles.inputWrapper} ref={dropDownListRef}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Find a repository..."
            value={searchText}
            onChange={handleChangeInput}
          />
          {isSearch && repositories?.repositories.length !== 0 && (
            <ul className={styles.searchRepositoriesWrapper} ref={searchRef}>
              {repositories?.repositories.map((repository, index) => (
                <li
                  key={index}
                  className={styles.repositoryItem}
                  onClick={() => handleRouterPush(repository.id)}
                >
                  <span className={styles.repositoryName}>
                    {repository.name}
                  </span>
                  <span className={styles.commitCount}>
                    {`${repository.commits?.length} ${
                      repository.commits && repository.commits?.length > 1
                        ? "commits"
                        : "commit"
                    }`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className={styles.rightContents}>
        <div
          className={styles.chevronDown}
          onClick={toggleIsShow}
          ref={dropDownListRef}
        >
          <Image
            src={"/icons/plus.svg"}
            width={20}
            height={20}
            alt="plus-icon"
          />
          {isShow && (
            <div className={styles.dropDownList}>
              {dropDownList.newList.map((item, index) => (
                <DropDownList item={item} key={index} />
              ))}
            </div>
          )}
        </div>
        <div
          className={styles.chevronDown}
          onClick={toggleIsShowProfile}
          ref={profileDropDownListRef}
        >
          {user?.image ? (
            <Image
              src={user.image}
              width={20}
              height={20}
              alt="profile-image"
              className={styles.userIcon}
            />
          ) : (
            <div className={styles.skeltonIcon}></div>
          )}

          {isShowProfile && (
            <div className={styles.dropDownList}>
              {dropDownList.myProfile.map((item, index) => (
                <DropDownList item={item} key={index} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div
        className={styles.rightContentsSp}
        onClick={() => setIsNav(!isNav)}
        ref={profileDropDownListRef}
      >
        <Image src={"/icons/bars.svg"} width={20} height={20} alt="bar-icon" />
      </div>
      {isNav && (
        <nav className={styles.spNav}>
          <ul className={styles.spNavContainer}>
            {navigationSp.map((nav, index) => (
              <Link
                key={index}
                href={
                  nav.title === "New repository"
                    ? {
                        pathname: nav.link,
                        query: { type: "user" },
                      }
                    : nav.link
                }
                className={styles.link}
              >
                {nav.title === "Sign out" ? (
                  <li
                    className={styles.spNavItem}
                    onClick={() => signOut({ callbackUrl: "/sign_in" })}
                    ref={navRef}
                  >
                    {nav.title}
                  </li>
                ) : (
                  <li className={styles.spNavItem} ref={navRef}>
                    {nav.title}
                  </li>
                )}
              </Link>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
});
