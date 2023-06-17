import { ApiClient } from "@/lib/api-client";
import { Repository, repositoryQuery } from "@/models/Repository";
import { generateQueryString } from "@/utils/queries";

export type RepositoryRepository = {
  getRepositories: (params: {
    queries: repositoryQuery;
  }) => Promise<{ repositories: Repository[]; totalNumber: number }>;
  getRepository: (id: string) => Promise<Repository>;
  createRepository: (
    params: Omit<Repository, "id" | "created_at" | "next_issue_id">
  ) => Promise<{ id: string }>;
  updateRepository: (
    params: Pick<Repository, "id" | "is_read_me" | "read_me">
  ) => Promise<Pick<Repository, "id" | "is_read_me" | "read_me">>;
  deleteRepository: (id: string) => Promise<void>;
};

const getRepositories: RepositoryRepository["getRepositories"] = async (
  params
) => {
  const response = await ApiClient.get(
    `/repository` + generateQueryString(params.queries)
  );
  return response.data;
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

const updateRepository: RepositoryRepository["updateRepository"] = async (
  params
) => {
  const response = await ApiClient.put(`/repository/${params.id}`, params);
  return response.data.repository;
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
  updateRepository,
  deleteRepository,
};
