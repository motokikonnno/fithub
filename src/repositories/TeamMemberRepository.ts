import { ApiClient } from "@/lib/api-client";
import { TeamMember } from "@/models/TeamMember";

export type TeamMemberRepository = {
  createTeamMember: (
    params: Pick<TeamMember, "team_id" | "user_id">
  ) => Promise<void>;
};

const createTeamMember: TeamMemberRepository["createTeamMember"] = async (
  params
) => {
  await ApiClient.post(`/team-member`, params);
};

export const teamMemberRepository: TeamMemberRepository = {
  createTeamMember,
};
