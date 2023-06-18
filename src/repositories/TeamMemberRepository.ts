import { ApiClient } from "@/lib/api-client";
import { TeamMember, teamMemberQuery } from "@/models/TeamMember";
import { UserBelongsToTeam } from "@/models/User";
import { generateQueryString } from "@/utils/queries";

export type TeamMemberRepository = {
  getTeamMembers: (params: {
    queries: teamMemberQuery;
  }) => Promise<{ members: UserBelongsToTeam[]; membersNumber: number }>;
  createTeamMember: (
    params: Pick<TeamMember, "team_id" | "user_id">
  ) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
};

const getTeamMembers: TeamMemberRepository["getTeamMembers"] = async (
  params
) => {
  const response = await ApiClient.get(
    `/team-member` + generateQueryString(params.queries)
  );
  return response.data;
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
  getTeamMembers,
  createTeamMember,
  deleteTeamMember,
};
