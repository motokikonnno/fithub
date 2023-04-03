import { SideBar } from "./SideBar";
import styles from "../styles/components/AppLayout.module.scss";
import { Header } from "./Header";

type AppLayoutProps = {
  children: React.ReactNode;
};

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <div className={styles.mainContents}>
        <SideBar />
        <div className={styles.layoutRight}>{children}</div>
      </div>
    </>
  );
};
