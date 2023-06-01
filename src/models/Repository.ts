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
    index: async (): Promise<Repository[]> => {
      const repositories = await repo.getRepositories();
      return repositories;
    },
    show: async (id: string): Promise<Repository> => {
      const repository = await repo.getRepository(id);
      return repository;
    },
    create: async (
      params: Omit<Repository, "id" | "created_at">
    ): Promise<void> => {
      await repo.createRepository(params);
    },
  };
};
