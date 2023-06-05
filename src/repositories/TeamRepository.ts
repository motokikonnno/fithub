import { ApiClient } from "@/lib/api-client";
import { Team } from "@/models/Team";

export type TeamRepository = {
  getTeams: () => Promise<Team[]>;
  getTeam: (id: string) => Promise<Team>;
  createTeam: (
    params: Pick<Team, "name" | "bio" | "image">
  ) => Promise<{ id: string }>;
};

const getTeams: TeamRepository["getTeams"] = async () => {
  const response = await ApiClient.get(`/team`);
  return response.data.teams;
};

const getTeam: TeamRepository["getTeam"] = async (id) => {
  const response = await ApiClient.get(`/team/${id}`);
  return response.data.team;
};

const createTeam: TeamRepository["createTeam"] = async (params) => {
  const response = await ApiClient.post(`/team`, params);
  return response.data.id;
};

export const teamRepository: TeamRepository = {
  getTeams,
  getTeam,
  createTeam,
};
