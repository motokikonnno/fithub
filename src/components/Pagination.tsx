import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import styles from "../styles/components/Pagination.module.scss";

type PaginationProps = {
  totalNumber: number;
  perPage: number;
  onChange: (e: { page: number }) => void;
};

export const Pagination: FC<PaginationProps> = ({
  totalNumber,
  perPage,
  onChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPage: number = Math.ceil(totalNumber / perPage);
  const isFirstRender = React.useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onChange({ page: currentPage });
  }, [currentPage]);

  const handleBack = (): void => {
    if (currentPage === 1) {
      return;
    }

    setCurrentPage(currentPage - 1);
  };

  const handleForward = (): void => {
    if (currentPage === totalPage) {
      return;
    }

    setCurrentPage(currentPage + 1);
  };

  const handleMove = (page: number): void => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.container}>
      {totalPage !== 0 && (
        <>
          <Image
            src={"/icons/angle-right.svg"}
            width={18}
            height={18}
            alt="angle-left"
            onClick={handleBack}
            className={styles.angleLeftIcon}
          />

          {currentPage > 3 && <li className={styles.dot}>・・</li>}
          <ul className={styles.paginationContainer}>
            {Array.from({ length: totalPage }, (_, i) => i)
              .filter((page) => Math.abs(currentPage - (page + 1)) <= 2)
              .map((page, index) => {
                page++;
                return (
                  <li
                    key={index}
                    onClick={() => handleMove(page)}
                    className={
                      page === currentPage ? styles.activeNumber : styles.number
                    }
                  >
                    {page}
                  </li>
                );
              })}
          </ul>
          {currentPage < totalPage - 2 && <li className={styles.dot}>・・</li>}

          <Image
            src={"/icons/angle-right.svg"}
            width={18}
            height={18}
            alt="angle-right"
            onClick={handleForward}
            className={styles.angleRightIcon}
          />
        </>
      )}
    </div>
  );
};
