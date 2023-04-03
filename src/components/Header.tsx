import styles from "../styles/components/Header.module.scss";
import Image from "next/image";
import { InputSearch } from "./InputSearch";

export const Header = () => {
  return (
    <div className={styles.container}>
      <Image src={"/logo.png"} width={32} height={32} alt={"ロゴ画像"} />
      <div className={styles.contentsWrapper}>
        <div className={styles.inputSearchWrapper}>
          <InputSearch
            placeholder={"Search or jump to..."}
            backgroundColor={"#000"}
            color={"#fff"}
            borderColor={"#656d76"}
          />
        </div>
        <div className={styles.rightContents}>
          <div className={styles.chevronDown}>
            <Image
              src={"/icons/plus.svg"}
              width={20}
              height={20}
              alt="profile画像"
            />
          </div>
          <div className={styles.chevronDown}>
            <Image src={"/logo.png"} width={20} height={20} alt="profile画像" />
          </div>
        </div>
      </div>
    </div>
  );
};
