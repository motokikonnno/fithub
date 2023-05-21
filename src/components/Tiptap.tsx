import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "next/image";
import React, { FC, useCallback } from "react";
import styles from "../styles/components/Tiptap.module.scss";

export const Tiptap = React.memo(() => {
  const editor = useEditor({
    extensions: [StarterKit, Link, Underline],
    content: "<h1>Hello World</h1>",
    editorProps: {
      attributes: {
        class: styles.editorContent,
      },
    },
  });

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
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <>
      <div className={styles.headMenuWrapper}>
        <EditorHeadMenu editor={editor} handleSetLink={handleSetLink} />
      </div>
      <EditorContent editor={editor} />
    </>
  );
});

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
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`${styles.headerMenu} ${
          editor.isActive("codeBlock") && styles.backgroundGray
        }`}
      >
        <Image src={"/icons/code.svg"} width={16} height={16} alt="code-icon" />
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
