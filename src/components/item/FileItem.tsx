import { repositoryFile } from "@/mock/mockRepositoryDetail";
import Image from "next/image";
import React, { FC } from "react";
import styles from "../../styles/components/item/FolderWithFileItem.module.scss";

type FileItemProps = {
  file: repositoryFile;
  handleModalClose: () => void;
};

export const FileItem: FC<FileItemProps> = React.memo(
  ({ file, handleModalClose }) => {
    return (
      <div className={styles.listWrapper}>
        <div className={styles.leftContainer}>
          <Image
            src={"/icons/file.svg"}
            width={16}
            height={14}
            alt="folder-icon"
            className={styles.icon}
          />
          <span className={styles.folderOrFileName} onClick={handleModalClose}>
            {file.name}
          </span>
        </div>
        <span className={styles.updatedAt}>{file.updatedAt}</span>
      </div>
    );
  }
);
