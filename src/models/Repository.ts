import {
  repositoryRepository,
  RepositoryRepository,
} from "@/repositories/RepositoryRepository";

export type Repository = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_private: Number;
  is_read_me: boolean;
  read_me?: string;
  created_at?: string;
};

export const repositoryFactory = (rep?: RepositoryRepository) => {
  const repo = rep ?? repositoryRepository;
  return {
    getAll: async (): Promise<Repository[]> => {
      const repositories = await repo.getAllRepositories();
      return repositories;
    },
    index: async (user_id: string): Promise<Repository[]> => {
      const repositories = await repo.getRepositories(user_id);
      return repositories;
    },
    show: async (
      user_id: string,
      repository_id: string
    ): Promise<Repository> => {
      const repository = await repo.getRepository(user_id, repository_id);
      return repository;
    },
    create: async (
      params: Omit<Repository, "id" | "created_at">
    ): Promise<void> => {
      await repo.createRepository(params);
    },
  };
};
