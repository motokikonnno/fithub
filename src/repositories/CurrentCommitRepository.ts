import { ApiClient } from "@/lib/api-client";
import { CurrentCommit } from "@/models/CurrentCommit";

export type CurrentCommitRepository = {
  getCurrentCommits: (id: string, user_id: string) => Promise<CurrentCommit[]>;
  createCurrentCommit: (
    params: Pick<
      CurrentCommit,
      "body_parts" | "file_id" | "message" | "user_id"
    >
  ) => Promise<void>;
  deleteCurrentCommit: (id: string) => Promise<void>;
};

const getCurrentCommits: CurrentCommitRepository["getCurrentCommits"] = async (
  id,
  user_id
) => {
  const response = await ApiClient.get(
    `/file/${id}/current-commits/${user_id}`
  );
  return response.data.current_commits;
};

const createCurrentCommit: CurrentCommitRepository["createCurrentCommit"] =
  async (params) => {
    await ApiClient.post(`/current-commit`, params);
  };

const deleteCurrentCommit: CurrentCommitRepository["deleteCurrentCommit"] =
  async (id) => {
    await ApiClient.delete(`/current-commit/${id}`);
  };

export const currentCommitRepository: CurrentCommitRepository = {
  getCurrentCommits,
  createCurrentCommit,
  deleteCurrentCommit,
};
