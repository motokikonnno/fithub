import { repositoryFolder } from "@/mock/mockRepositoryDetail";
import Image from "next/image";
import React, { FC } from "react";
import styles from "../../styles/components/item/FolderWithFileItem.module.scss";

type FolderItemProps = {
  folder: repositoryFolder;
  handleCurrentFolder: (id: string, name: string) => void;
};

export const FolderItem: FC<FolderItemProps> = React.memo(
  ({ folder, handleCurrentFolder }) => {
    return (
      <div className={styles.listWrapper}>
        <div className={styles.leftContainer}>
          <Image
            src={"/icons/folder.svg"}
            width={16}
            height={14}
            alt="folder-icon"
            className={styles.icon}
          />
          <span
            className={styles.folderOrFileName}
            onClick={() => handleCurrentFolder(folder.id, folder.name)}
          >
            {folder.name}
          </span>
        </div>
        <span className={styles.updatedAt}>{folder.updatedAt}</span>
      </div>
    );
  }
);
