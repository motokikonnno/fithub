import { Calender, calenderFactory } from "@/models/Calender";
import useSWR from "swr";

const calenderFetcher = async (key: string): Promise<Calender[]> => {
  const id = key.split("_")[0];
  const data = await calenderFactory().index(id);
  return data;
};

const useFetchCalender = (id: string | null) => {
  const { data: calender } = useSWR<Calender[]>(
    id ? `${id}_calender` : null,
    calenderFetcher
  );
  return { calender };
};

export default useFetchCalender;
