import { fileRepository, FileRepository } from "@/repositories/FileRepository";
import { Commit } from "./Commit";
import { CurrentCommit } from "./CurrentCommit";
import { Repository } from "./Repository";
import { User } from "./User";

export type File = {
  id: string;
  name: string;
  parent_id: string;
  created_at: string;
  repository_id: string;
  user_id: string;
  repository: Repository;
  commits?: Commit[];
  current_commits?: CurrentCommit[];
  user: User;
};

export const fileFactory = (rep?: FileRepository) => {
  const repository = rep ?? fileRepository;
  return {
    create: async (
      params: Pick<File, "name" | "repository_id" | "parent_id" | "user_id">
    ): Promise<void> => {
      await repository.createFile(params);
    },
    update: async (params: Pick<File, "id" | "name">): Promise<void> => {
      await repository.updateFile(params);
    },
    delete: async (id: string): Promise<void> => {
      await repository.deleteFile(id);
    },
  };
};
