import {
  commitRepository,
  CommitRepository,
} from "@/repositories/CommitRepository";
import { Repository } from "./Repository";
import { Team } from "./Team";
import { UserBelongsToTeam } from "./User";

export type Commit = {
  id: string;
  message: string;
  body_parts: number;
  created_at: string;
  file_id: string;
  user_id: string;
  team_id?: string;
  repository_id: string;
  file: File;
  user: UserBelongsToTeam;
  team?: Team;
  repository: Repository;
};

export const commitFactory = (rep?: CommitRepository) => {
  const repository = rep ?? commitRepository;
  return {
    index: async (
      id: string,
      page: number
    ): Promise<{ commits: Commit[]; totalNumber: number }> => {
      const commits = await repository.getCommits(id, page);
      return commits;
    },
    create: async (params: {
      file_id: string;
      user_id: string;
    }): Promise<void> => {
      await repository.createCommit(params);
    },
  };
};
