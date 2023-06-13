import { ApiClient } from "@/lib/api-client";
import { Commit } from "@/models/Commit";

export type CommitRepository = {
  getCommits: (id: string) => Promise<Commit[]>;
  createCommit: (params: { file_id: string; user_id: string }) => Promise<void>;
};

const getCommits: CommitRepository["getCommits"] = async (id) => {
  const response = await ApiClient.get(`/file/${id}/commits`);
  return response.data.commits;
};

const createCommit: CommitRepository["createCommit"] = async (params) => {
  await ApiClient.post(`/commit`, params);
};

export const commitRepository: CommitRepository = {
  getCommits,
  createCommit,
};
