import { teamRepository, TeamRepository } from "@/repositories/TeamRepository";
import { Commit } from "./Commit";
import { Repository } from "./Repository";
import { TeamMember } from "./TeamMember";

export type Team = {
  id: string;
  name: string;
  bio?: string;
  image: string;
  created_at: string;
  repositories?: Repository[];
  team_members?: TeamMember[];
  commits?: Commit[];
};

export type createTeamType = {
  name: string;
  bio: string;
  image: string;
  user_id: string;
};

export const teamFactory = (rep?: TeamRepository) => {
  const repository = rep ?? teamRepository;
  return {
    index: async (): Promise<Team[]> => {
      const teams = await repository.getTeams();
      return teams;
    },
    show: async (id: string): Promise<Team> => {
      const team = await repository.getTeam(id);
      return team;
    },
    create: async (params: createTeamType): Promise<{ id: string }> => {
      const team = await repository.createTeam(params);
      return team;
    },
    update: async (
      params: Pick<Team, "id" | "name" | "bio" | "image">
    ): Promise<Team> => {
      const team = await repository.updateTeam(params);
      return team;
    },
  };
};
