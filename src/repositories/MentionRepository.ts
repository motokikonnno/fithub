import { ApiClient } from "@/lib/api-client";
import { Mention } from "@/models/Mention";

export type MentionRepository = {
  updateMention: (
    params: Pick<Mention, "mentioned_user_id" | "issue_id" | "mentioner_id">
  ) => Promise<void>;
};

const updateMention: MentionRepository["updateMention"] = async (params) => {
  await ApiClient.put(`/mention/${params.issue_id}`, params);
};

export const mentionRepository: MentionRepository = {
  updateMention,
};
