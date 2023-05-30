import React, { FC } from "react";
import { AppLayout } from "../layouts/AppLayout";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import styles from "../../styles/components/pages/Dashboard.module.scss";
import { Footer } from "../layouts/Footer";
import { DefaultUser } from "next-auth";

type Activities = {
  name: string;
  repository: string;
  action: string;
  createdAt: string;
};

export type DashboardProps = {
  user:
    | (DefaultUser & {
        id: string;
      })
    | undefined;
};

export const Dashboard: FC<DashboardProps> = React.memo(({ user }) => {
  const activities: Activities[] = [
    {
      name: "太郎",
      repository: "muscle",
      action: "push",
      createdAt: "3 days ago",
    },
    {
      name: "小助",
      repository: "fithub",
      action: "push",
      createdAt: "5 days ago",
    },
    {
      name: "佐藤",
      repository: "fitness",
      action: "comment",
      createdAt: "6 days ago",
    },
  ];

  return (
    <AppLayout>
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
      <h2 className={styles.sectionTitle}>Activities</h2>
      {activities.map((activity, index) => (
        <ActivityItem activity={activity} key={index} />
      ))}
      <Footer />
    </AppLayout>
  );
});

const ActivityItem: React.FC<{ activity: Activities }> = ({ activity }) => {
  return (
    <div className={styles.activityWrapper}>
      <div className={styles.createdAt}>{activity.createdAt}</div>
      <div className={styles.activityContent}>
        {`${activity.name}さんが${activity.repository}に${activity.action}しました`}
      </div>
    </div>
  );
};
