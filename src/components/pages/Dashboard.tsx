import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import styles from "../../styles/components/pages/Dashboard.module.scss";
import { UserBelongsToTeam } from "@/models/User";
import { Activity } from "@/models/Activity";
import { getTimeDiff } from "@/utils/getTime";
import useFetchActivity from "@/hooks/useFetchActivity";

export type DashboardProps = {
  user: UserBelongsToTeam;
  activities: Activity[];
};

export const Dashboard: FC<DashboardProps> = React.memo(
  ({ user, activities }) => {
    const { activitiesData, setSize } = useFetchActivity(user.id, activities);
    const bottomDivRef = useRef<HTMLDivElement>(null);
    const [fetchMoreFlag, setFetchMoreFlag] = useState(false);

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
        <div className={styles.calendarContainer}>
          <CalendarHeatmap
            startDate={new Date("2023-01-01")}
            endDate={new Date("2023-12-31")}
            values={[
              { date: "2023-05-22", count: 12 },
              { date: "2023-07-24", count: 12 },
              { date: "2023-11-10", count: 12 },
            ]}
          />
        </div>
        {activities.length !== 0 && (
          <>
            <h2 className={styles.sectionTitle}>Activities</h2>
            {activitiesData?.flatMap((activityArray) =>
              activityArray.map((a, index) => (
                <ActivityItem activity={a} key={index} />
              ))
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
