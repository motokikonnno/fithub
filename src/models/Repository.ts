import {
  repositoryRepository,
  RepositoryRepository,
} from "@/repositories/RepositoryRepository";
import { Commit } from "./Commit";
import { File } from "./File";
import { Folder } from "./Folder";
import { Issue } from "./Issue";
import { Team } from "./Team";
import { User } from "./User";

export type Repository = {
  id: string;
  next_issue_id: number;
  user_id?: string;
  team_id?: string;
  commit_id?: string;
  name: string;
  description?: string;
  is_private: Number;
  is_read_me: boolean;
  read_me?: string;
  created_at: string;
  folders?: Folder[];
  files?: File[];
  issues?: Issue[];
  user?: User;
  team?: Team;
  commits?: Commit[];
};

export type repositoryQuery = {
  isPrivate: boolean;
  type: "user" | "team";
  owner_id: string;
  page?: number;
  search?: string;
};

export const repositoryFactory = (rep?: RepositoryRepository) => {
  const repo = rep ?? repositoryRepository;
  return {
    index: async (params: {
      queries: repositoryQuery;
    }): Promise<{ repositories: Repository[]; totalNumber: number }> => {
      const repositories = await repo.getRepositories(params);
      return repositories;
    },
    show: async (id: string): Promise<Repository> => {
      const repository = await repo.getRepository(id);
      return repository;
    },
    create: async (
      params: Omit<Repository, "id" | "created_at" | "next_issue_id">
    ): Promise<{ id: string } | void> => {
      const repository = await repo.createRepository(params);
      return repository;
    },
    update: async (
      params: Pick<Repository, "id" | "is_read_me" | "read_me">
    ): Promise<Pick<Repository, "id" | "is_read_me" | "read_me">> => {
      const repository = await repo.updateRepository(params);
      return repository;
    },
    delete: async (id: string): Promise<void> => {
      await repo.deleteRepository(id);
    },
  };
};
