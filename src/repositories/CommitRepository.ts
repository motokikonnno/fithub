import { ApiClient } from "@/lib/api-client";
import { Commit } from "@/models/Commit";
import { generateQueryString } from "@/utils/queries";

export type CommitRepository = {
  getCommits: (
    id: string,
    page: number
  ) => Promise<{ commits: Commit[]; totalNumber: number }>;
  createCommit: (params: { file_id: string; user_id: string }) => Promise<void>;
};

const getCommits: CommitRepository["getCommits"] = async (id, page) => {
  const response = await ApiClient.get(
    `/file/${id}/commits` + generateQueryString({ page })
  );
  return response.data;
};

const createCommit: CommitRepository["createCommit"] = async (params) => {
  await ApiClient.post(`/commit`, params);
};

export const commitRepository: CommitRepository = {
  getCommits,
  createCommit,
};
