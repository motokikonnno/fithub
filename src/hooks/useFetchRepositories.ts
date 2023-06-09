import {
  Repository,
  repositoryFactory,
  repositoryQuery,
} from "@/models/Repository";
import useSWR from "swr";

const repositoryFetcher = async (key: {
  queries: repositoryQuery;
}): Promise<{
  repositories: Repository[];
  totalNumber: number;
}> => {
  const data = await repositoryFactory().index(key);
  return data;
};

const useFetchRepositories = (params: { queries: repositoryQuery }) => {
  const { data: repository, isLoading: isLoad } = useSWR<{
    repositories: Repository[];
    totalNumber: number;
  }>(params, repositoryFetcher);
  return { repository, isLoad };
};

export default useFetchRepositories;
