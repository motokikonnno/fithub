import { ApiClient } from "@/lib/api-client";
import { CurrentCommit } from "@/models/CurrentCommit";

export type CurrentCommitRepository = {
  createCurrentCommit: (
    params: Pick<
      CurrentCommit,
      "body_parts" | "file_id" | "message" | "user_id"
    >
  ) => Promise<void>;
  deleteCurrentCommit: (id: string) => Promise<void>;
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
  createCurrentCommit,
  deleteCurrentCommit,
};
