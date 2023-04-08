import React, { useRef } from "react";
import { Header } from "../Header";
import styles from "../../styles/components/pages/CreateTeam.module.scss";
import Image from "next/image";

export const CreateTeam = React.memo(() => {
  const iconInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectFile = () => {
    if (iconInputRef.current) {
      iconInputRef.current.click();
    }
  };

  return (
    <>
      <Header />
      <div className={styles.layoutContainer}>
        <h1 className={styles.pageTitle}>Set up your team</h1>
        <div className={styles.teamNameContainer}>
          <div className={styles.formSection}>Team name</div>
          <input className={styles.inputForm} />
        </div>
        <div className={styles.formSectionTeam}>Team icon</div>
        <button className={styles.fileButton} onClick={handleSelectFile}>
          <span className={styles.uploadIcon}>
            <Image
              src={"/icons/upload.svg"}
              width={12}
              height={12}
              alt="アップロードアイコン"
            />
          </span>
          Upload a photo
        </button>
        <input type="file" accept="image/*" hidden ref={iconInputRef} />
        <div className={styles.initializeText}>This team belongs to:</div>
        <div className={styles.personalAccountWrapper}>
          <input type="radio" className={styles.radioForm} name="accountType" />
          <label className={styles.label}>My personal account</label>
        </div>
        <div className={styles.businessAccountWrapper}>
          <input type="radio" className={styles.radioForm} name="accountType" />
          <label className={styles.label}>A business or institution</label>
        </div>
        <div className={styles.createTeamButton}>Create team</div>
      </div>
    </>
  );
});
