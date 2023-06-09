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
