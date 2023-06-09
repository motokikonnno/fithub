import { Team, teamFactory } from "@/models/Team";
import useSWR from "swr";

const teamFetcher = async (key: string): Promise<Team> => {
  const data = await teamFactory().show(key);
  return data;
};

const useFetchTeam = (id: string | null) => {
  const { data: team } = useSWR<Team>(id ? id : null, teamFetcher);
  return { team };
};

export default useFetchTeam;
