import { Count, countFactory } from "@/models/Count";
import useSWR from "swr";

const countFetcher = async (key: string): Promise<Count> => {
  const data = await countFactory().get(key);
  return data;
};

const useFetchCount = (id: string | null, initialData?: Count) => {
  const { data: count, mutate: countMutate } = useSWR<Count>(
    id ? id : null,
    countFetcher,
    { fallbackData: initialData }
  );
  return { count, countMutate };
};

export default useFetchCount;
