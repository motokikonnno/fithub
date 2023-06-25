import React, { useCallback, useEffect, useRef, useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import styles from "../../styles/components/pages/Dashboard.module.scss";
import { Activity } from "@/models/Activity";
import { formatMonthEnglish, getTimeDiff } from "@/utils/getTime";
import useFetchActivity from "@/hooks/useFetchActivity";
import { Calender } from "@/models/Calender";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import { Footer } from "../layouts/Footer";
import { SEO } from "../SEO";
import useFetchCalender from "@/hooks/useFetchCalender";
import { useSession } from "next-auth/react";
import useFetchUser from "@/hooks/useFetchUser";

export const Dashboard = React.memo(() => {
  const weekdays = ["Mon", "Wed", "Fri"];
  const { data: session } = useSession();
  const { user } = useFetchUser(session ? session.user.id : null);
  const { calender } = useFetchCalender(session ? session.user.id : null);
  const { activitiesData, setSize } = useFetchActivity(
    session ? session.user.id : null
  );
  const bottomDivRef = useRef<HTMLDivElement>(null);
  const [fetchMoreFlag, setFetchMoreFlag] = useState(false);
  const currentYear = new Date().getFullYear();
  const [yearNumber, setYearNumber] = useState(currentYear);
  const currentMonth = new Date().getMonth() + 1;
  const [monthNumber, setMonthNumber] = useState(currentMonth);
  const endDay = monthNumber === 2 || 4 || 6 || 9 || 11 ? 30 : 31;
  const [endDayNumber, setEndDayNumber] = useState(endDay);

  const getMoreActivities = useCallback(() => {
    setSize((prevSize) => prevSize + 1);
  }, [setSize]);

  useEffect(() => {
    if (!bottomDivRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setFetchMoreFlag(true);
        }
      });
    });
    observer.observe(bottomDivRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (fetchMoreFlag) {
      getMoreActivities();
      setFetchMoreFlag(false);
    }
  }, [fetchMoreFlag, setFetchMoreFlag, getMoreActivities]);

  useEffect(() => {
    const endDay = monthNumber === 2 || 4 || 6 || 9 || 11 ? 30 : 31;
    setEndDayNumber(endDay);
  }, [monthNumber, setMonthNumber]);

  return (
    <>
      <SEO title={"FitHub"} url={"/"} />
      <AppLayout user={user}>
        <h2 className={styles.sectionTitle}>Contributions</h2>
        <div className={styles.yearContainer}>
          <Image
            src={`/icons/angle-right.svg`}
            width={18}
            height={18}
            alt="angle-left-icon"
            className={styles.angleLeftIcon}
            onClick={() => setYearNumber(yearNumber - 1)}
          />
          <time className={styles.currentYear}>{yearNumber}</time>
          <Image
            src={`/icons/angle-right.svg`}
            width={18}
            height={18}
            alt="angle-right-icon"
            onClick={() => setYearNumber(yearNumber + 1)}
            className={styles.angleRightIcon}
          />
        </div>
        <div className={styles.monthWrapper}>
          <div className={styles.monthContainer}>
            <Image
              src={`/icons/angle-right.svg`}
              width={18}
              height={18}
              alt="angle-left-icon"
              className={styles.angleLeftIcon}
              onClick={() =>
                monthNumber === 1
                  ? setMonthNumber(12)
                  : setMonthNumber(monthNumber - 1)
              }
            />
            <time className={styles.currentYear}>
              {formatMonthEnglish(monthNumber)}
            </time>
            <Image
              src={`/icons/angle-right.svg`}
              width={18}
              height={18}
              alt="angle-right-icon"
              onClick={() =>
                monthNumber === 12
                  ? setMonthNumber(1)
                  : setMonthNumber(monthNumber + 1)
              }
              className={styles.angleRightIcon}
            />
          </div>
          <ul className={styles.weekdaysSp}>
            {weekdays.map((weekday, index) => (
              <li key={index}>{weekday}</li>
            ))}
          </ul>
        </div>
        {calender && (
          <>
            <div className={styles.calendarContainer}>
              <ul className={styles.weekdayContainer}>
                {weekdays.map((weekday, index) => (
                  <li key={index} className={styles.weekday}>
                    {weekday}
                  </li>
                ))}
              </ul>
              <CalendarHeatmap
                startDate={new Date(`${yearNumber}-01-01`)}
                endDate={new Date(`${yearNumber}-12-31`)}
                values={calender}
                tooltipDataAttrs={(value: Calender) => {
                  if (!value || !value.date) {
                    return null;
                  }
                  return {
                    "data-tooltip-content": `${value.date} commit： ${value.commitNumber}`,
                    "data-tooltip-id": "tooltip",
                  };
                }}
                classForValue={(value) => {
                  if (!value) {
                    return "color-empty";
                  }
                  return `color-github-${value.count}`;
                }}
              />
            </div>
            <div className={styles.calendarContainerSp}>
              <CalendarHeatmap
                startDate={new Date(`${yearNumber}-0${monthNumber}-01`)}
                endDate={
                  new Date(`${yearNumber}-0${monthNumber}-${endDayNumber}`)
                }
                values={calender}
                horizontal={false}
                showMonthLabels={false}
                tooltipDataAttrs={(value: Calender) => {
                  if (!value || !value.date) {
                    return null;
                  }
                  return {
                    "data-tooltip-content": `${value.date} commit： ${value.commitNumber}`,
                    "data-tooltip-id": "tooltip",
                  };
                }}
                classForValue={(value) => {
                  if (!value) {
                    return "color-empty";
                  }
                  return `color-github-${value.count}`;
                }}
              />
            </div>
          </>
        )}
        <Tooltip id="tooltip" />
        {activitiesData && activitiesData.length !== 0 && (
          <>
            <h2 className={styles.sectionTitle}>Activities</h2>
            {activitiesData?.flatMap((activityArray) =>
              activityArray.map((a) => <ActivityItem activity={a} key={a.id} />)
            )}
          </>
        )}
        <div ref={bottomDivRef} />
        <Footer />
      </AppLayout>
    </>
  );
});

const ActivityItem: React.FC<{ activity: Activity }> = ({ activity }) => {
  const createdAt = getTimeDiff(activity.created_at);
  return (
    <div className={styles.activityWrapper}>
      <div className={styles.createdAt}>{createdAt}</div>
      <div className={styles.activityContent}>{activity.body}</div>
    </div>
  );
};
