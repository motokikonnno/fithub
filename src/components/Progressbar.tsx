import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/components/Progressbar.module.scss";

export const Progressbar = () => {
  const router = useRouter();
  useEffect(() => {
    router.events.on("routeChangeStart", (e) => {
      setBar({ d: "1s", n: "barstart" });
    });
    router.events.on("routeChangeComplete", (e) => {
      setBar({ d: "0.2s", n: "barcomp" });
    });
  }, []);
  const [bar, setBar] = useState({ d: "5s", n: "barstart" });
  return (
    <div
      className={styles.progressbar}
      style={{
        animation: bar.d + " 0s normal backwards running " + bar.n,
      }}
    ></div>
  );
};
