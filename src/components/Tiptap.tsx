import { issueFactory } from "@/models/Issue";
import { Repository, repositoryFactory } from "@/models/Repository";
import { User } from "@/models/User";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { FC, useCallback, useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import styles from "../styles/components/Tiptap.module.scss";

type TiptapProps = {
  text?: string;
  repository: Repository;
  type: "issue" | "readme" | "createIssue";
  handleTitleText?: () => void;
  titleText?: string;
  user?: User;
};

export const Tiptap: FC<TiptapProps> = React.memo(
  ({ text, repository, type, handleTitleText, titleText, user }) => {
    const router = useRouter();
    const [tiptapEditFlag, setTiptapEditFlag] = useState(false);
    const editor = useEditor({
      extensions: [StarterKit, Link, Underline],
      content: text,
      editorProps: {
        attributes: {
          class: styles.editorContent,
        },
      },
    });
    const { handleSubmit, control, setValue } = useForm();

    useEffect(() => {
      editor?.setEditable(tiptapEditFlag);
    }, [editor, tiptapEditFlag, type]);

    useEffect(() => {
      if (editor) {
        editor.on("update", () => {
          setValue("content", editor.getHTML());
        });
      }
    }, [editor, setValue]);

    const handleCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      e.preventDefault();
      if (text) editor?.commands.setContent(text);
      setTiptapEditFlag(!tiptapEditFlag);
    };

    const handleEdit = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      e.preventDefault();
      setTiptapEditFlag(!tiptapEditFlag);
    };

    const onSubmit = async (data: FieldValues) => {
      const readme = data.content as string;
      if (type === "readme") {
        await repositoryFactory().update({
          read_me: readme,
          is_read_me: true,
          id: repository.id,
        });
        setTiptapEditFlag(false);
      } else if (type === "issue") {
        setTiptapEditFlag(false);
      } else if (type === "createIssue") {
        if (titleText && user?.id) {
          const newIssue = await issueFactory().create({
            title: titleText,
            issue: readme,
            repository_id: repository.id,
            user_id: user.id,
          });
        }
        if (handleTitleText) handleTitleText();
        // TODO: リダイレクト先をissue詳細ページに変更する
        router.push(`/user/${user?.id}/repository/${repository.id}?tab=Issue`);
      }
    };

    const onCreateSubmit = async (data: FieldValues) => {
      const readme = data.content as string;
      if (titleText && user?.id) {
        const newIssue = await issueFactory().create({
          title: titleText,
          issue: readme,
          repository_id: repository.id,
          user_id: user.id,
        });
      }
      if (handleTitleText) handleTitleText();
      // TODO: リダイレクト先をissue詳細ページに変更する
      router.push(`/user/${user?.id}/repository/${repository.id}?tab=Issue`);
    };

    const handleSetLink = useCallback(() => {
      if (!editor) return;

      const previousUrl = editor.getAttributes("link").href;
      const url = window.prompt("URL", previousUrl);
      // cancelled
      if (url === null) {
        return;
      }

      // empty
      if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }

      // update link
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }, [editor]);

    if (!editor) {
      return null;
    }

    if (type === "createIssue") {
      editor.setEditable(true);
    }

    return (
      <>
        {type === "createIssue" ? (
          <div className={styles.headMenuWrapper}>
            <EditorHeadMenu editor={editor} handleSetLink={handleSetLink} />
          </div>
        ) : (
          tiptapEditFlag && (
            <div className={styles.headMenuWrapper}>
              <EditorHeadMenu editor={editor} handleSetLink={handleSetLink} />
            </div>
          )
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="content"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <EditorContent
                editor={editor}
                onChange={() => field.onChange(editor.getHTML)}
              />
            )}
          />

          <div className={styles.saveButtonContainer}>
            {type === "createIssue" ? (
              <button className={styles.submitIssueButton} type="submit">
                Submit new issue
              </button>
            ) : tiptapEditFlag ? (
              <>
                <button type="submit" className={styles.saveButton}>
                  Save
                </button>
                <button onClick={handleCancel} className={styles.cancelButton}>
                  Cancel
                </button>
              </>
            ) : (
              <button className={styles.editButton} onClick={handleEdit}>
                Edit
              </button>
            )}
          </div>
        </form>
      </>
    );
  }
);

type EditorHeadMenuProps = {
  editor: Editor;
  handleSetLink: () => void;
};

const EditorHeadMenu: FC<EditorHeadMenuProps> = ({ editor, handleSetLink }) => {
  return (
    <div className={styles.headerContainer}>
      <div
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${styles.headerMenu} ${
          editor.isActive("heading", { level: 1 }) && styles.backgroundGray
        }`}
      >
        <Image
          src={"/icons/h-one.svg"}
          width={16}
          height={16}
          alt="h-one-icon"
        />
      </div>
      <div
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${styles.headerMenu} ${
          editor.isActive("bold") && styles.backgroundGray
        }`}
      >
        <Image src={"/icons/bold.svg"} width={16} height={16} alt="bold-icon" />
      </div>
      <div
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`${styles.headerMenu} ${
          editor.isActive("strike") && styles.backgroundGray
        }`}
      >
        <Image
          src={"/icons/strikethrough.svg"}
          width={16}
          height={16}
          alt="strike-icon"
        />
      </div>
      <div
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`${styles.headerMenu} ${
          editor.isActive("underline") && styles.backgroundGray
        }`}
      >
        <Image
          src={"/icons/underline.svg"}
          width={16}
          height={16}
          alt="underline-icon"
        />
      </div>
      <div
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${styles.headerMenu} ${
          editor.isActive("bulletList") && styles.backgroundGray
        }`}
      >
        <Image
          src={"/icons/list-ul.svg"}
          width={16}
          height={16}
          alt="list-ul-icon"
        />
      </div>
      <div
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${styles.headerMenu} ${
          editor.isActive("orderedList") && styles.backgroundGray
        }`}
      >
        <Image
          src={"/icons/list-ol.svg"}
          width={16}
          height={16}
          alt="list-ol-icon"
        />
      </div>
      <div
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`${styles.headerMenu} ${
          editor.isActive("blockQuote") && styles.backgroundGray
        }`}
      >
        <Image
          src={"/icons/quote-left.svg"}
          width={16}
          height={16}
          alt="quote-left-icon"
        />
      </div>
      <div
        onClick={handleSetLink}
        className={`${styles.headerMenu} ${
          editor.isActive("link") && styles.backgroundGray
        }`}
      >
        <Image
          src={"/icons/sns-link.svg"}
          width={16}
          height={16}
          alt="bold-icon"
        />
      </div>
      <div
        onClick={() => editor.chain().focus().undo().run()}
        className={styles.headerMenu}
      >
        <Image
          src={"/icons/redo.svg"}
          width={16}
          height={16}
          alt="redo-icon"
          className={styles.undoIcon}
        />
      </div>
      <div
        onClick={() => editor.chain().focus().redo().run()}
        className={styles.headerMenu}
      >
        <Image src={"/icons/redo.svg"} width={16} height={16} alt="redo-icon" />
      </div>
    </div>
  );
};
