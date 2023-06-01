import { Header } from "../layouts/Header";
import styles from "../../styles/components/pages/CreateRepository.module.scss";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { repositoryFactory } from "@/models/Repository";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useFetchUser from "@/hooks/useFetchUser";

export type ownerType = {
  name: string;
  icon: string;
};

type createRepositoryType = {
  name: string;
  description?: string;
  is_private: number;
  is_read_me: boolean;
};

export const ownerList = [
  {
    name: "motoki",
    icon: "/example.png",
  },
  {
    name: "スダリオ",
    icon: "/example.png",
  },
  {
    name: "クレべル",
    icon: "/example.png",
  },
  {
    name: "牛久",
    icon: "/example.png",
  },
];

export const CreateRepository = React.memo(() => {
  const { data: session } = useSession();
  const { user } = useFetchUser(session?.user.id ? session.user.id : null);
  const [owner, setOwner] = useState({ name: "akito", icon: "/example.png" });
  const [toggleOwnerList, setToggleOwnerList] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createRepositoryType>({ mode: "onChange" });

  const handleSetOwner = (owner: ownerType) => {
    setOwner(owner);
    setToggleOwnerList(false);
  };

  const onSubmit = async (data: createRepositoryType) => {
    if (user) {
      const createData: createRepositoryType = {
        ...data,
        is_private: Number(data.is_private),
      };
      await repositoryFactory().create({
        user_id: user.id,
        read_me: "",
        ...createData,
      });
      // TODO: リダイレクト先をrepository詳細ページに変更する
      router.push(`/user/${user?.id}?tab=Repositories`);
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
              <div className={styles.relative}>
                <div
                  className={styles.ownerContainer}
                  onClick={() => setToggleOwnerList(!toggleOwnerList)}
                >
                  <Image
                    src={owner.icon}
                    width={16}
                    height={16}
                    alt="user-icon"
                    className={styles.userIcon}
                  />
                  {owner.name}
                </div>
                {toggleOwnerList && (
                  <ul className={styles.listWrapper}>
                    {ownerList.map((owner, index) => (
                      <li
                        onClick={() => handleSetOwner(owner)}
                        key={index}
                        className={styles.listItem}
                      >
                        <Image
                          src={owner.icon}
                          width={16}
                          height={16}
                          alt="owner-icon"
                        />
                        {owner.name}
                      </li>
                    ))}
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
});
