import {
  teamMemberRepository,
  TeamMemberRepository,
} from "@/repositories/TeamMemberRepository";
import { Team } from "./Team";
import { UserBelongsToTeam } from "./User";

export type TeamMember = {
  id: string;
  user_id: string;
  team_id: string;
  owner: number;
  created_at: string;
  user: UserBelongsToTeam;
  team: Team;
};

export const teamMemberFactory = (rep?: TeamMemberRepository) => {
  const repository = rep ?? teamMemberRepository;
  return {
    create: async (
      params: Pick<TeamMember, "team_id" | "user_id">
    ): Promise<void> => {
      await repository.createTeamMember(params);
    },
  };
};
