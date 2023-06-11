import {
  currentCommitRepository,
  CurrentCommitRepository,
} from "@/repositories/CurrentCommitRepository";
import { File } from "./File";
import { UserBelongsToTeam } from "./User";

export type CurrentCommit = {
  id: string;
  message: string;
  body_parts: number;
  created_at: string;
  user_id: string;
  file_id: string;
  user: UserBelongsToTeam;
  file: File;
};

export const currentCommitFactory = (rep?: CurrentCommitRepository) => {
  const repository = rep ?? currentCommitRepository;
  return {
    create: async (
      params: Pick<
        CurrentCommit,
        "body_parts" | "file_id" | "message" | "user_id"
      >
    ): Promise<void> => {
      await repository.createCurrentCommit(params);
    },
    delete: async (id: string): Promise<void> => {
      await repository.deleteCurrentCommit(id);
    },
  };
};
