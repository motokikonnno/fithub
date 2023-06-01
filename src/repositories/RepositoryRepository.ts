import { ApiClient } from "@/lib/api-client";
import { Repository } from "@/models/Repository";

export type RepositoryRepository = {
  getRepositories: () => Promise<Repository[]>;
  getRepository: (id: string) => Promise<Repository>;
  createRepository: (params: Omit<Repository, "id">) => Promise<void>;
};

const getRepositories: RepositoryRepository["getRepositories"] = async () => {
  const response = await ApiClient.get(`/repository`);
  return response.data.repositories;
};

const getRepository: RepositoryRepository["getRepository"] = async (id) => {
  const response = await ApiClient.get(`/repository/${id}`);
  return response.data.repository;
};

const createRepository: RepositoryRepository["createRepository"] = async (
  params
) => {
  await ApiClient.post(`/repository`, params);
};

export const repositoryRepository: RepositoryRepository = {
  getRepositories,
  getRepository,
  createRepository,
};
