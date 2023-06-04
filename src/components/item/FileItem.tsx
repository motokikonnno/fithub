import useFetchUser from "@/hooks/useFetchUser";
import { File } from "@/models/File";
import { getTimeDiff } from "@/utils/getTime";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import styles from "../../styles/components/item/FolderWithFileItem.module.scss";

type FileItemProps = {
  file: File;
  handleModalClose: () => void;
  toggleAction: boolean;
  toggleInput: boolean;
  defaultText: string;
  currentFolderOrFileId: string;
  inputRef: React.RefObject<HTMLInputElement>;
  handleCurrentType: (type: "folder" | "file") => void;
  handleConfirmModal: (id?: string) => void;
  handleSetComposing: () => void;
  handleSetDefaultText: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleEditInput: (id: string, name: string, type: "folder" | "file") => void;
  submitEditEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const FileItem: FC<FileItemProps> = React.memo(
  ({
    file,
    toggleAction,
    toggleInput,
    defaultText,
    currentFolderOrFileId,
    inputRef,
    handleCurrentType,
    handleModalClose,
    handleSetComposing,
    handleConfirmModal,
    handleSetDefaultText,
    toggleEditInput,
    submitEditEnter,
  }) => {
    const created_at = getTimeDiff(file.created_at);
    const { user } = useFetchUser(file.user_id);
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
          {toggleInput && file.id === currentFolderOrFileId ? (
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
              onClick={handleModalClose}
            >
              {file.name}
            </span>
          )}
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.createUserWrapper}>
            <span className={styles.createBy}>created by</span>
            {user?.image && (
              <Image
                src={user?.image}
                width={14}
                height={14}
                alt="user-icon"
                className={styles.userIcon}
              />
            )}
            <Link href={`/user/${file.user_id}`} className={styles.userName}>
              {user?.name}
            </Link>
          </div>
          <time className={styles.createdAt}>{created_at}</time>
          {toggleAction && (
            <div className={styles.actionContainer}>
              <Image
                src={"/icons/edit-gray.svg"}
                width={14}
                height={16}
                alt="edit-icon"
                className={styles.actionIcon}
                onClick={() => toggleEditInput(file.id, file.name, "file")}
              />
              <Image
                src={"/icons/trash.svg"}
                width={14}
                height={16}
                alt="trash-icon"
                className={styles.actionIcon}
                onClick={() => {
                  handleConfirmModal(file.id);
                  handleCurrentType("file");
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);
