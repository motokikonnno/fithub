import React from "react";
import styles from "../styles/components/InputSearch.module.scss";

type InputSearchProps = {
  placeholder: string;
  backgroundColor: string;
  color: string;
  borderColor: string;
};

export const InputSearch: React.FC<InputSearchProps> = React.memo(
  ({ placeholder, backgroundColor, color, borderColor }) => {
    return (
      <>
        <input
          className={styles.inputSearch}
          placeholder={placeholder}
          style={{
            backgroundColor: backgroundColor,
            color: color,
            border: `solid 1px ${borderColor}`,
          }}
        />
      </>
    );
  }
);
