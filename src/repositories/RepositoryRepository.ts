import { ApiClient } from "@/lib/api-client";
import { Repository } from "@/models/Repository";

export type RepositoryRepository = {
  getAllRepositories: () => Promise<Repository[]>;
  getRepositories: (user_id: string) => Promise<Repository[]>;
  getRepository: (
    user_id: string,
    repository_id: string
  ) => Promise<Repository>;
  createRepository: (params: Omit<Repository, "id">) => Promise<void>;
};

const getAllRepositories: RepositoryRepository["getAllRepositories"] =
  async () => {
    const response = await ApiClient.get(`/repositories`);
    return response.data.repositories;
  };

const getRepositories: RepositoryRepository["getRepositories"] = async (
  user_id
) => {
  const response = await ApiClient.get(`/user/${user_id}/repository`);
  return response.data.repositories;
};

const getRepository: RepositoryRepository["getRepository"] = async (
  user_id,
  repository_id
) => {
  const response = await ApiClient.get(
    `/user/${user_id}/repository/${repository_id}`
  );
  return response.data.repository;
};

const createRepository: RepositoryRepository["createRepository"] = async (
  params
) => {
  await ApiClient.post(`/repository`, params);
};

export const repositoryRepository: RepositoryRepository = {
  getAllRepositories,
  getRepositories,
  getRepository,
  createRepository,
};
