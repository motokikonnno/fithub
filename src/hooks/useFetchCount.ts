import { Count, countFactory } from "@/models/Count";
import useSWR from "swr";

const countFetcher = async (key: string): Promise<Count> => {
  const data = await countFactory().get(key);
  return data;
};

const useFetchCount = (id: string | null) => {
  const { data: count } = useSWR<Count>(id ? id : null, countFetcher);
  return { count };
};

export default useFetchCount;
