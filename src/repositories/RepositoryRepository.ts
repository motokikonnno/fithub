import { ApiClient } from "@/lib/api-client";
import { Repository } from "@/models/Repository";

export type RepositoryRepository = {
  getRepositories: () => Promise<Repository[]>;
  getRepository: (id: string) => Promise<Repository>;
  createRepository: (
    params: Omit<Repository, "id" | "created_at">
  ) => Promise<{ id: string }>;
  deleteRepository: (id: string) => Promise<void>;
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
  const response = await ApiClient.post(`/repository`, params);
  return response.data.id;
};

const deleteRepository: RepositoryRepository["deleteRepository"] = async (
  id
) => {
  await ApiClient.delete(`/repository/${id}`);
};

export const repositoryRepository: RepositoryRepository = {
  getRepositories,
  getRepository,
  createRepository,
  deleteRepository,
};
