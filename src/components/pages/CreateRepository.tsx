import { Header } from "../layouts/Header";
import styles from "../../styles/components/pages/CreateRepository.module.scss";
import Image from "next/image";
import React, { useState } from "react";

export type ownerType = {
  name: string;
  icon: string;
};

export const ownerList = [
  {
    name: "motoki",
    icon: "/example.png",
  },
  {
    name: "スダリオ",
    icon: "/example.png",
  },
  {
    name: "クレべル",
    icon: "/example.png",
  },
  {
    name: "牛久",
    icon: "/example.png",
  },
];

export const CreateRepository = React.memo(() => {
  const [owner, setOwner] = useState({ name: "akito", icon: "/example.png" });
  const [toggleOwnerList, setToggleOwnerList] = useState(false);

  const handleSetOwner = (owner: ownerType) => {
    setOwner(owner);
    setToggleOwnerList(false);
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Create a new repository</h1>
        <div className={styles.nameFormContainer}>
          <div className={styles.ownerWrapper}>
            <div className={styles.formSection}>Owner</div>
            <div className={styles.relative}>
              <div
                className={styles.ownerContainer}
                onClick={() => setToggleOwnerList(!toggleOwnerList)}
              >
                <Image
                  src={owner.icon}
                  width={16}
                  height={16}
                  alt="user-icon"
                  className={styles.userIcon}
                />
                {owner.name}
              </div>
              {toggleOwnerList && (
                <ul className={styles.listWrapper}>
                  {ownerList.map((owner, index) => (
                    <li
                      onClick={() => handleSetOwner(owner)}
                      key={index}
                      className={styles.listItem}
                    >
                      <Image
                        src={owner.icon}
                        width={16}
                        height={16}
                        alt="owner-icon"
                      />
                      {owner.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <span className={styles.slash}>/</span>
          <div className={styles.repositoryWrapper}>
            <div className={styles.formSection}>Repository name</div>
            <input className={styles.inputFormRepository} />
          </div>
        </div>
        <div className={styles.descriptionContainer}>
          <div className={styles.optionalSection}>
            Description<span className={styles.optional}>（optional）</span>
          </div>
          <input className={styles.inputFormDescription} />
        </div>
        <div className={styles.publicWrapper}>
          <input
            type="radio"
            className={styles.radioForm}
            checked
            name="visibility"
          />
          <div className={styles.icon}>
            <Image
              src={"/icons/public.svg"}
              width={18}
              height={22}
              alt="publicアイコン"
            />
          </div>
          <label className={styles.label}>Public</label>
        </div>
        <div className={styles.privateWrapper}>
          <input type="radio" className={styles.radioForm} name="visibility" />
          <div className={styles.icon}>
            <Image
              src={"/icons/private.svg"}
              width={18}
              height={22}
              alt="privateアイコン"
            />
          </div>
          <label className={styles.label}>Private</label>
        </div>
        <div className={styles.initializeText}>
          Initialize this repository with:
        </div>
        <div className={styles.readmeWrapper}>
          <input type="checkbox" className={styles.checkbox} />
          <label className={styles.label}>Add a README file</label>
        </div>
        <span className={styles.createButton}>Create repository</span>
      </div>
    </>
  );
});
