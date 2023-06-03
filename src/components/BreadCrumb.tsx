import { FC, memo } from "react";
import styles from "../styles/components/BreadCrumb.module.scss";
import { itemType } from "./pages/UserProfile";

type BreadCrumbProps = {
  folderTitle?: itemType[];
  repository: string;
  handleViewRepository: (id: string) => void;
};

export const BreadCrumb: FC<BreadCrumbProps> = memo(
  ({ folderTitle, repository, handleViewRepository }) => {
    return (
      <div className={styles.container}>
        <div className={styles.title} onClick={() => handleViewRepository("")}>
          {repository}
        </div>
        {folderTitle &&
          folderTitle.map((title) => (
            <div key={title.id} className={styles.titleContainer}>
              <span className={styles.slash}>/</span>
              <div
                className={styles.title}
                onClick={() => handleViewRepository(title.id)}
              >
                {title.name}
              </div>
            </div>
          ))}
      </div>
    );
  }
);
