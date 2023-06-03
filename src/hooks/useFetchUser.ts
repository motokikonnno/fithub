import { User, userFactory } from "@/models/User";
import useSWR from "swr";

const userFetcher = async (key: string): Promise<User> => {
  const data = await userFactory().show(key);
  return data;
};

const useFetchUser = (id: string | null) => {
  const { data: user } = useSWR<User>(id ? id : null, userFetcher);
  return { user };
};

export default useFetchUser;
