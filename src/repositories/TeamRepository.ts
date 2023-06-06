import { ApiClient } from "@/lib/api-client";
import { createTeamType, Team } from "@/models/Team";

export type TeamRepository = {
  getTeams: () => Promise<Team[]>;
  getTeam: (id: string) => Promise<Team>;
  createTeam: (params: createTeamType) => Promise<{ id: string }>;
  updateTeam: (
    params: Pick<Team, "name" | "bio" | "image" | "id">
  ) => Promise<Team>;
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

const updateTeam: TeamRepository["updateTeam"] = async (params) => {
  const response = await ApiClient.put(`/team/${params.id}`, params);
  return response.data.team;
};

export const teamRepository: TeamRepository = {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
};
