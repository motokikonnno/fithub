import {
  activityRepository,
  ActivityRepository,
} from "@/repositories/ActivityRepository";
import { User } from "./User";

export type Activity = {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  user: User;
};

export const activityFactory = (rep?: ActivityRepository) => {
  const repository = rep ?? activityRepository;
  return {
    index: async (user_id: string, page?: number): Promise<Activity[]> => {
      const activities = await repository.getActivities(user_id, page);
      return activities;
    },
  };
};
