import React, { FC } from "react";
import { AppLayout } from "../layouts/AppLayout";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import styles from "../../styles/components/pages/Dashboard.module.scss";
import { UserBelongsToTeam } from "@/models/User";
import { Activity } from "@/models/Activity";
import { getTimeDiff } from "@/utils/getTime";

export type DashboardProps = {
  user: UserBelongsToTeam;
  activities: Activity[];
};

export const Dashboard: FC<DashboardProps> = React.memo(
  ({ user, activities }) => {
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
            {activities.map((activity, index) => (
              <ActivityItem activity={activity} key={index} />
            ))}
          </>
        )}
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
