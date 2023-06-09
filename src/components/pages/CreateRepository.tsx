import { Header } from "../layouts/Header";
import styles from "../../styles/components/pages/CreateRepository.module.scss";
import Image from "next/image";
import React, { FC, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { repositoryFactory } from "@/models/Repository";
import { NextRouter } from "next/router";
import { Owner } from "@/types/owner";

export type CreateRepositoryProps = {
  ownerList: Owner[];
  currentOwner: Owner;
  type: "user" | "team";
  router: NextRouter;
};

type createRepositoryType = {
  name: string;
  description?: string;
  is_private: number;
  is_read_me: boolean;
};

export const CreateRepository: FC<CreateRepositoryProps> = React.memo(
  ({ ownerList, currentOwner, type, router }) => {
    const [owner, setOwner] = useState<Owner>(currentOwner);
    const [toggleOwnerList, setToggleOwnerList] = useState(false);
    const [currentType, setCurrentType] = useState(type);
    const [currentOwnerList, setCurrentOwnerList] = useState(ownerList);
    const dropDownListRef = useRef<HTMLDivElement>(null);
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<createRepositoryType>({ mode: "onChange" });

    useEffect(() => {
      const handleClickToCloseDropDown = (event: MouseEvent) => {
        if (!(event.target instanceof HTMLElement)) {
          return;
        }
        const element = dropDownListRef.current;

        if (element && element?.contains(event.target)) return;
        setToggleOwnerList(false);
      };
      window.addEventListener("click", handleClickToCloseDropDown, true);
      return () => {
        window.removeEventListener("click", handleClickToCloseDropDown);
      };
    }, []);

    useEffect(() => {
      const ownerArray = ownerList.filter(({ id }) => id !== currentOwner.id);
      setCurrentOwnerList(ownerArray);
    }, [currentOwner.id, ownerList]);

    const handleSetOwner = (owner: Owner, type: "user" | "team") => {
      const ownerArray = ownerList.filter(({ id }) => id !== owner.id);
      setCurrentOwnerList(ownerArray);
      setOwner(owner);
      setToggleOwnerList(false);
      setCurrentType(type);
    };

    const onSubmit = async (data: createRepositoryType) => {
      if (owner.id && currentType === "user") {
        const createData: createRepositoryType = {
          ...data,
          is_private: Number(data.is_private),
        };
        const newRepository = await repositoryFactory().create({
          user_id: owner.id,
          ...createData,
        });
        if (newRepository) {
          router.push(`/user/${owner.id}/repository/${newRepository}`);
        }
      } else if (owner.id && currentType === "team") {
        const createData: createRepositoryType = {
          ...data,
          is_private: Number(data.is_private),
        };
        const newRepository = await repositoryFactory().create({
          team_id: owner.id,
          ...createData,
        });
        if (newRepository) {
          router.push(`/team/${owner.id}/repository/${newRepository}`);
        }
      }
    };

    return (
      <>
        <Header />
        <div className={styles.container}>
          <h1 className={styles.title}>Create a new repository</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.nameFormContainer}>
              <div className={styles.ownerWrapper}>
                <div className={styles.formSection}>Owner</div>
                <div className={styles.relative} ref={dropDownListRef}>
                  {owner.image && (
                    <div
                      className={styles.ownerContainer}
                      onClick={() => setToggleOwnerList(!toggleOwnerList)}
                    >
                      <Image
                        src={owner.image}
                        width={16}
                        height={16}
                        alt="user-icon"
                        className={styles.userIcon}
                      />
                      {owner.name}
                    </div>
                  )}
                  {toggleOwnerList && (
                    <ul className={styles.listWrapper}>
                      {currentOwnerList.map(
                        (owner, index) =>
                          owner.image && (
                            <li
                              onClick={() => handleSetOwner(owner, owner.type)}
                              key={index}
                              className={styles.listItem}
                            >
                              <Image
                                src={owner.image}
                                width={16}
                                height={16}
                                alt="owner-icon"
                              />
                              {owner.name}
                            </li>
                          )
                      )}
                    </ul>
                  )}
                </div>
              </div>
              <span className={styles.slash}>/</span>
              <div className={styles.repositoryWrapper}>
                <div className={styles.formSection}>Repository name</div>
                <input
                  className={styles.inputFormRepository}
                  {...register("name", { required: "※ Name is required" })}
                />
                <p className={styles.errorMessage}>{errors.name?.message}</p>
              </div>
            </div>
            <div className={styles.descriptionContainer}>
              <div className={styles.optionalSection}>
                Description<span className={styles.optional}>（optional）</span>
              </div>
              <input
                className={styles.inputFormDescription}
                {...register("description")}
              />
            </div>
            <div className={styles.publicWrapper}>
              <input
                type="radio"
                className={styles.radioForm}
                checked
                value={1}
                {...register("is_private")}
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
              <input
                type="radio"
                className={styles.radioForm}
                value={2}
                {...register("is_private")}
              />
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
              <input
                type="checkbox"
                className={styles.checkbox}
                {...register("is_read_me")}
              />
              <label className={styles.label}>Add a README file</label>
            </div>
            <button className={styles.createButton} type="submit">
              Create repository
            </button>
          </form>
        </div>
      </>
    );
  }
);
