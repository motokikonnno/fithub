import { Folder } from "@/models/Folder";
import { getTimeDiff } from "@/utils/getTime";
import Image from "next/image";
import React, { FC } from "react";
import styles from "../../styles/components/item/FolderWithFileItem.module.scss";

type FolderItemProps = {
  folder: Folder;
  toggleAction: boolean;
  toggleInput: boolean;
  defaultText: string;
  currentFolderOrFileId: string;
  inputRef: React.RefObject<HTMLInputElement>;
  handleCurrentFolder: (id: string, name: string) => void;
  handleConfirmModal: (id?: string) => void;
  handleSetComposing: () => void;
  handleSetDefaultText: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleEditInput: (id: string, name: string, type: "folder" | "file") => void;
  submitEditEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const FolderItem: FC<FolderItemProps> = React.memo(
  ({
    folder,
    toggleAction,
    toggleInput,
    defaultText,
    currentFolderOrFileId,
    inputRef,
    handleSetComposing,
    handleCurrentFolder,
    handleConfirmModal,
    handleSetDefaultText,
    toggleEditInput,
    submitEditEnter,
  }) => {
    const created_at = getTimeDiff(folder.created_at);
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
          {toggleInput && folder.id === currentFolderOrFileId ? (
            <input
              type="text"
              className={styles.editInput}
              value={defaultText}
              onChange={handleSetDefaultText}
              autoFocus={true}
              ref={inputRef}
              onCompositionStart={handleSetComposing}
              onCompositionEnd={handleSetComposing}
              onKeyDown={(e) => submitEditEnter(e)}
            />
          ) : (
            <span
              className={styles.folderOrFileName}
              onClick={() => handleCurrentFolder(folder.id, folder.name)}
            >
              {folder.name}
            </span>
          )}
        </div>
        <div className={styles.rightContainer}>
          <span className={styles.createdAt}>{created_at}</span>
          {toggleAction && (
            <div className={styles.actionContainer}>
              <Image
                src={"/icons/edit-gray.svg"}
                width={14}
                height={16}
                alt="edit-icon"
                className={styles.actionIcon}
                onClick={() =>
                  toggleEditInput(folder.id, folder.name, "folder")
                }
              />
              <Image
                src={"/icons/trash.svg"}
                width={14}
                height={16}
                alt="trash-icon"
                className={styles.actionIcon}
                onClick={() => handleConfirmModal(folder.id)}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);
