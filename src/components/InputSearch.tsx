import React from "react";
import styles from "../styles/components/InputSearch.module.scss";

type InputSearchProps = {
  placeholder: string;
  backgroundColor: string;
  color: string;
  borderColor: string;
  searchText: string;
  handleChangeSearchText: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => Promise<void>;
};

export const InputSearch: React.FC<InputSearchProps> = React.memo(
  ({
    placeholder,
    backgroundColor,
    color,
    borderColor,
    searchText,
    handleChangeSearchText,
    onSubmit,
  }) => {
    const submitEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.nativeEvent.isComposing || e.key !== "Enter") return;
      onSubmit();
    };

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
          value={searchText}
          onChange={handleChangeSearchText}
          onKeyDown={(e) => submitEnter(e)}
        />
      </>
    );
  }
);
