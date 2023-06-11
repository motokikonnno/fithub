import { ApiClient } from "@/lib/api-client";

export type CommitRepository = {
  createCommit: (params: { file_id: string; user_id: string }) => Promise<void>;
};

const createCommit: CommitRepository["createCommit"] = async (params) => {
  await ApiClient.post(`/commit`, params);
};

export const commitRepository: CommitRepository = {
  createCommit,
};
