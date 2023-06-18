import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import styles from "../../styles/components/pages/Dashboard.module.scss";
import { UserBelongsToTeam } from "@/models/User";
import { Activity } from "@/models/Activity";
import { getTimeDiff } from "@/utils/getTime";
import useFetchActivity from "@/hooks/useFetchActivity";
import { Calender } from "@/models/Calender";
import Image from "next/image";
import { Tooltip } from "react-tooltip";

export type DashboardProps = {
  user: UserBelongsToTeam;
  activities: Activity[];
  calender: Calender[];
};

export const Dashboard: FC<DashboardProps> = React.memo(
  ({ user, activities, calender }) => {
    const weekdays = ["Mon", "Wed", "Fri"];
    const { activitiesData, setSize } = useFetchActivity(user.id, activities);
    const bottomDivRef = useRef<HTMLDivElement>(null);
    const [fetchMoreFlag, setFetchMoreFlag] = useState(false);
    const currentYear = new Date().getFullYear();
    const [yearNumber, setYearNumber] = useState(currentYear);

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

    return (
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
        <Tooltip id="tooltip" />
        {activities.length !== 0 && (
          <>
            <h2 className={styles.sectionTitle}>Activities</h2>
            {activitiesData?.flatMap((activityArray) =>
              activityArray.map((a) => <ActivityItem activity={a} key={a.id} />)
            )}
          </>
        )}
        <div ref={bottomDivRef} />
      </AppLayout>
    );
  }
);

const ActivityItem: React.FC<{ activity: Activity }> = ({ activity }) => {
  const createdAt = getTimeDiff(activity.created_at);
  return (
    <div className={styles.activityWrapper}>
      <div className={styles.createdAt}>{createdAt}</div>
      <div className={styles.activityContent}>{activity.body}</div>
    </div>
  );
};
