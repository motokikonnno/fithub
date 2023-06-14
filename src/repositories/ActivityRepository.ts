import { ApiClient } from "@/lib/api-client";
import { Activity } from "@/models/Activity";

export type ActivityRepository = {
  getActivities: (user_id: string) => Promise<Activity[]>;
};

const getActivities: ActivityRepository["getActivities"] = async (user_id) => {
  const response = await ApiClient.get(`/activity/${user_id}`);
  return response.data.activities;
};

export const activityRepository = {
  getActivities,
};
