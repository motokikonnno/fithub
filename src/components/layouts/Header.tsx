import styles from "../../styles/components/layouts/Header.module.scss";
import Image from "next/image";
import { DropDownList } from "../list/DropDownList";
import React, { FC, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import useFetchUser from "@/hooks/useFetchUser";

type HeaderProps = {
  is_edit?: boolean;
};

export const Header: FC<HeaderProps> = React.memo(({ is_edit }) => {
  const { data: session } = useSession();
  const [isShow, setIsShow] = useState(false);
  const [isShowProfile, setIsShowProfile] = useState(false);
  const dropDownListRef = useRef<HTMLDivElement>(null);
  const profileDropDownListRef = useRef<HTMLDivElement>(null);
  const { user, userMutate } = useFetchUser(
    session?.user.id ? session.user.id : null
  );

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
      if (
        (element && element?.contains(event.target)) ||
        (profileElement && profileElement?.contains(event.target))
      )
        return;
      setIsShow(false);
      setIsShowProfile(false);
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

  return (
    <header className={styles.container}>
      <Link href={"/"}>
        <Image src={"/logo.png"} width={32} height={32} alt={"ロゴ画像"} />
      </Link>
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
          {user?.image && (
            <Image
              src={user.image}
              width={20}
              height={20}
              alt="profile-image"
              className={styles.userIcon}
            />
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
    </header>
  );
});
