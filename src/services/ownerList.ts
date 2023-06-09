import { UserBelongsToTeam } from "@/models/User";
import { Owner, OwnerWithRepositories } from "@/types/owner";

export const shapeOwnerDataWithRepositories = (
  user: UserBelongsToTeam
): { userData: OwnerWithRepositories; teamData: OwnerWithRepositories[] } => {
  const userData: OwnerWithRepositories = {
    id: user.id,
    name: user.name,
    image: user.image,
    repositories: user.repositories,
    type: "user",
  };

  const teamData: OwnerWithRepositories[] = user.team_members
    ? user.team_members.map(({ team }) => {
        const data: OwnerWithRepositories = {
          id: team.id,
          name: team.name,
          image: team.image,
          repositories: team.repositories,
          type: "team",
        };
        return data;
      })
    : [];
  return { userData: userData, teamData: teamData };
};

export const shapeOwnerDataList = (
  user: UserBelongsToTeam
): { teamData: Owner[] } => {
  const teamData = user.team_members
    ? user.team_members.map(({ team }) => {
        const data: Owner = {
          id: team.id,
          name: team.name,
          image: team.image,
          type: "team",
        };
        return data;
      })
    : [];

  return { teamData: teamData };
};
