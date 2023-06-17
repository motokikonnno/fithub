import { UserBelongsToTeam, userFactory } from "@/models/User";
import useSWR from "swr";

const userFetcher = async (key: string): Promise<UserBelongsToTeam> => {
  const data = await userFactory().show(key);
  return data;
};

const useFetchUser = (id: string | null) => {
  const {
    data: user,
    isLoading,
    mutate: userMutate,
  } = useSWR<UserBelongsToTeam>(id ? id : null, userFetcher);
  return { user, isLoading, userMutate };
};

export default useFetchUser;
