import { Activity, activityFactory } from "@/models/Activity";

import useSWRInfinite from "swr/infinite";
import { SWRInfiniteKeyLoader } from "swr/infinite";

const activityFetcher: (
  params: ["activities", string, number]
) => Promise<Activity[]> = async ([key, siteId, page]) => {
  const data = await activityFactory().index(siteId, page);
  return data;
};

const useFetchActivity = (user_id: string, initialData: Activity[]) => {
  const getKey: SWRInfiniteKeyLoader = (
    pageIndex: number,
    previousPageData: Activity[]
  ) => {
    if (previousPageData && !previousPageData.length) return null;
    return ["activities", user_id, pageIndex + 1];
  };
  const fallbackData: Activity[][] = [initialData];
  const { data: activitiesData, setSize } = useSWRInfinite<Activity[]>(
    getKey,
    activityFetcher,
    {
      fallbackData,
      revalidateFirstPage: false,
    }
  );
  return { activitiesData, setSize };
};

export default useFetchActivity;
