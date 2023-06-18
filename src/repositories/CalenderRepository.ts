import { ApiClient } from "@/lib/api-client";
import { Calender } from "@/models/Calender";

export type CalenderRepository = {
  getCalender: (user_id: string) => Promise<Calender[]>;
};

const getCalender: CalenderRepository["getCalender"] = async (user_id) => {
  const response = await ApiClient.get(`/calender/${user_id}`);
  return response.data.commitCounts;
};

export const calenderRepository = {
  getCalender,
};
