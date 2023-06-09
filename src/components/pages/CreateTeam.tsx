import React, { useEffect, useRef, useState } from "react";
import { Header } from "../layouts/Header";
import styles from "../../styles/components/pages/CreateTeam.module.scss";
import Image from "next/image";
import { handleDeleteImage, onUploadToFireStorage } from "@/lib/storageUpload";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { teamFactory } from "@/models/Team";
import { useSession } from "next-auth/react";
import { Footer } from "../layouts/Footer";
import { SEO } from "../SEO";
import { Loading } from "../Loading";

type createTeam = {
  name: string;
  bio: string;
};

export const CreateTeam = React.memo(() => {
  const iconInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const defaultImage =
    "https://firebasestorage.googleapis.com/v0/b/fithub-a295f.appspot.com/o/default%2Fif2dmi1ea10tfgha.png?alt=media&token=6b1fa117-48f3-4858-9383-7b86e70685b0";
  const { data: session } = useSession();
  const [isDisable, setIsDisable] = useState(false);
  const [deleteFile, setDeleteFile] = useState<string[]>([]);
  const [currentFile, setCurrentFile] = useState<string>(defaultImage);
  const [isLoading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createTeam>({ mode: "onChange" });

  useEffect(() => {
    const handlePopstate = () => {
      if (deleteFile) handleDeleteImage(deleteFile, currentFile);
      router.back();
    };
    history.pushState(null, "", null);
    window.addEventListener("popstate", handlePopstate, false);
    return () => {
      removeEventListener("popstate", handlePopstate, false);
    };
  }, [currentFile, deleteFile, router]);

  const handleSelectFile = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
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

  const onSubmit = async (data: createTeam) => {
    if (session?.user.id) {
      setIsDisable(true);
      const newTeam = await teamFactory().create({
        user_id: session.user.id,
        image: currentFile,
        ...data,
      });
      if (newTeam) router.push(`/team/${newTeam}`);
      setIsDisable(false);
    }
  };

  return (
    <>
      <SEO title={"FitHub"} url={"/team/new"} />
      {isDisable && <Loading />}
      <Header />
      <div className={styles.layoutContainer}>
        <h1 className={styles.pageTitle}>Set up your team</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.teamNameContainer}>
            <div className={styles.formSection}>Team name</div>
            <input
              className={styles.inputForm}
              {...register("name", {
                required: "※ Name is required",
                maxLength: {
                  value: 50,
                  message: "Please enter within 50 characters",
                },
              })}
            />
            <p className={styles.errorMessage}>{errors.name?.message}</p>
          </div>
          <div className={styles.teamBioContainer}>
            <div className={styles.formSectionOptional}>
              Team bio（optional）
            </div>
            <textarea className={styles.inputForm} {...register("bio")} />
            <p className={styles.errorMessage}>{errors.bio?.message}</p>
          </div>
          <div className={styles.formSectionTeam}>Team image</div>
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
            Upload a image
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
          <button
            className={styles.createTeamButton}
            onClick={() =>
              !isDisable && handleDeleteImage(deleteFile, currentFile)
            }
            type="submit"
            disabled={isDisable}
          >
            Create team
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
});
