import styles from "../styles/components/Header.module.scss";
import Image from "next/image";
import { InputSearch } from "./InputSearch";
import { DropDownList } from "./DropDownList";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

export const Header = React.memo(() => {
  const [isShow, setIsShow] = useState(false);
  const [isShowProfile, setIsShowProfile] = useState(false);
  const dropDownListRef = useRef<HTMLDivElement>(null);
  const profileDropDownListRef = useRef<HTMLDivElement>(null);

  const dropDownList = {
    newList: [
      { title: "New repository", link: "/repository/new" },
      { title: "New team", link: "/team/new" },
    ],
    myProfile: [
      { title: "Your profile", link: "/mypage" },
      { title: "Your repositories", link: "/mypage?tab=Repositories" },
      { title: "Your teams", link: "/team" },
      { title: "Sign out", link: "/" },
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
      if (element && element?.contains(event.target)) return;
      setIsShow(false);
    };
    window.addEventListener("click", handleClickToCloseDropDown, true);
    return () => {
      window.removeEventListener("click", handleClickToCloseDropDown);
    };
  }, []);

  useEffect(() => {
    const handleClickToCloseProfileDropDown = (event: MouseEvent) => {
      if (!(event.target instanceof HTMLElement)) {
        return;
      }
      const element = profileDropDownListRef.current;
      if (element && element?.contains(event.target)) return;
      setIsShowProfile(false);
    };
    window.addEventListener("click", handleClickToCloseProfileDropDown, true);
    return () => {
      window.removeEventListener("click", handleClickToCloseProfileDropDown);
    };
  }, []);

  return (
    <div className={styles.container}>
      <Link href={"/dashboard"}>
        <Image src={"/logo.png"} width={32} height={32} alt={"ロゴ画像"} />
      </Link>
      <div className={styles.contentsWrapper}>
        <div className={styles.inputSearchWrapper}>
          <InputSearch
            placeholder={"Search or jump to..."}
            backgroundColor={"#000"}
            color={"#fff"}
            borderColor={"#656d76"}
          />
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
              alt="profile画像"
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
            <Image src={"/logo.png"} width={20} height={20} alt="profile画像" />
            {isShowProfile && (
              <div className={styles.dropDownList}>
                {dropDownList.myProfile.map((item, index) => (
                  <DropDownList item={item} key={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
