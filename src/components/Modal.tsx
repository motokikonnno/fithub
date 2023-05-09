import React, { ReactNode, FC } from "react";
import styles from "../styles/components/Modal.module.scss";

type ModalProps = {
  isVisible: boolean;
  handleClose: () => void;
  children: ReactNode;
};

export const Modal: FC<ModalProps> = React.memo(
  ({ children, isVisible, handleClose }) => {
    if (!isVisible) return null;
    return (
      <div className={styles.modalElem} onClick={() => handleClose()}>
        <div className={styles.modalInner}>
          <div
            onClick={(e) => e.stopPropagation()}
            className={styles.modalContent}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);
