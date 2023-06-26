import { Count } from "@/models/Count";
import { changeBodyPartsNumber } from "@/utils/changeBodyPartsNumber";
import { FC } from "react";
import styles from "../styles/components/PercentageBar.module.scss";

type PercentageBarProps = {
  count: Count;
};

type Colors = {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  [key: number]: string;
};

export const PercentageBar: FC<PercentageBarProps> = ({ count }) => {
  const colors: Colors = {
    1: "#ff3300",
    2: "#3333ff",
    3: "#00dd00",
    4: "#FFD700",
    5: "#7b3cff",
    6: "#a0522d",
    7: "#d3d3d3",
  };

  return (
    <>
      <div className={styles.bar}>
        {count &&
          Object.entries(count).map(([key, value], index) => (
            <div
              key={key}
              style={{
                flex: value,
                backgroundColor: colors[Number(key)],
              }}
              className={`${index === 0 && styles.firstItem} ${
                Object.entries(count).length - 1 === index && styles.lastItem
              }`}
            />
          ))}
      </div>
      <div className={styles.colorDetail}>
        {count &&
          Object.entries(count).map(([key, value]) => (
            <span
              key={key}
              className={`${styles.keyItem} ${
                styles[changeBodyPartsNumber(Number(key)).color]
              }`}
            >
              {changeBodyPartsNumber(Number(key)).bodyPartName}(
              {value && Math.round(value)}%)
            </span>
          ))}
      </div>
    </>
  );
};
