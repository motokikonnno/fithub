import { ApiClient } from "@/lib/api-client";
import { TeamMember } from "@/models/TeamMember";

export type TeamMemberRepository = {
  createTeamMember: (
    params: Pick<TeamMember, "team_id" | "user_id">
  ) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
};

const createTeamMember: TeamMemberRepository["createTeamMember"] = async (
  params
) => {
  await ApiClient.post(`/team-member`, params);
};

const deleteTeamMember: TeamMemberRepository["deleteTeamMember"] = async (
  id
) => {
  await ApiClient.delete(`/team-member/${id}`);
};

export const teamMemberRepository: TeamMemberRepository = {
  createTeamMember,
  deleteTeamMember,
};
