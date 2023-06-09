import {
  mentionRepository,
  MentionRepository,
} from "@/repositories/MentionRepository";
import { Issue } from "./Issue";
import { UserBelongsToTeam } from "./User";

export type Mention = {
  id: string;
  issue_id: string;
  mentioner_id: string;
  mentioned_user_id: string;
  issue: Issue;
  user: UserBelongsToTeam;
};

export const mentionFactory = (rep?: MentionRepository) => {
  const repository = rep ?? mentionRepository;
  return {
    update: async (
      params: Pick<Mention, "mentioned_user_id" | "issue_id" | "mentioner_id">
    ): Promise<void> => {
      await repository.updateMention(params);
    },
  };
};
