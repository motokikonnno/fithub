import React, { useRef, useState } from "react";
import { Header } from "../Header";
import styles from "../../styles/components/pages/CreateTeam.module.scss";
import Image from "next/image";
import { handleDeleteImage, onUploadToFireStorage } from "@/lib/storageUpload";

// TODO: 保存せずに戻った場合にstorageから削除する処理を作成する

export const CreateTeam = React.memo(() => {
  const iconInputRef = useRef<HTMLInputElement | null>(null);
  const defaultImage =
    "https://firebasestorage.googleapis.com/v0/b/fithub-a295f.appspot.com/o/default%2Fif2dmi1ea10tfgha.png?alt=media&token=6b1fa117-48f3-4858-9383-7b86e70685b0";
  const [deleteFile, setDeleteFile] = useState<string[]>([]);
  const [currentFile, setCurrentFile] = useState<string>(defaultImage);
  const [isLoading, setLoading] = useState(false);

  const handleSelectFile = () => {
    if (iconInputRef.current) {
      iconInputRef.current.click();
    }
  };

  const handleLoadingFile = (flag: boolean) => {
    setLoading(flag);
  };

  const handleSetFile = (deleteFile: string[], url: string) => {
    setDeleteFile(deleteFile);
    setCurrentFile(url);
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
        <div className={styles.teamIconContainer}>
          {isLoading ? (
            <div className={styles.skeltonImage}></div>
          ) : (
            <Image
              src={currentFile}
              width={226}
              height={226}
              alt="team-icon"
              className={styles.teamIcon}
            />
          )}
        </div>
        <button className={styles.fileButton} onClick={handleSelectFile}>
          <span className={styles.uploadIcon}>
            <Image
              src={"/icons/upload.svg"}
              width={12}
              height={12}
              alt="upload-icon"
            />
          </span>
          Upload a photo
        </button>

        <input
          type="file"
          accept=".png, .jpeg, .jpg"
          hidden
          ref={iconInputRef}
          onChange={(e) =>
            onUploadToFireStorage(
              e,
              "team",
              deleteFile,
              handleLoadingFile,
              handleSetFile
            )
          }
        />
        <div className={styles.initializeText}>This team belongs to:</div>
        <div className={styles.personalAccountWrapper}>
          <input type="radio" className={styles.radioForm} name="accountType" />
          <label className={styles.label}>My personal account</label>
        </div>
        <div className={styles.businessAccountWrapper}>
          <input type="radio" className={styles.radioForm} name="accountType" />
          <label className={styles.label}>A business or institution</label>
        </div>
        <button
          className={styles.createTeamButton}
          onClick={() => handleDeleteImage(deleteFile, currentFile)}
        >
          Create team
        </button>
      </div>
    </>
  );
});
