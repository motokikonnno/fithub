import { Repository } from "@/models/Repository";

export const recentSortRepositories = (repositories: Repository[]) => {
  const data = [...repositories].sort((a, b) => {
    return Date.parse(b.created_at) - Date.parse(a.created_at);
  });
  return data;
};
