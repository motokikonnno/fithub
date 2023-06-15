import { ApiClient } from "@/lib/api-client";
import { Activity } from "@/models/Activity";
import { generateQueryString } from "@/utils/queries";

export type ActivityRepository = {
  getActivities: (user_id: string, page?: number) => Promise<Activity[]>;
};

const getActivities: ActivityRepository["getActivities"] = async (
  user_id,
  page
) => {
  const response = await ApiClient.get(
    `/activity/${user_id}` + generateQueryString({ page })
  );
  return response.data.activities;
};

export const activityRepository = {
  getActivities,
};
