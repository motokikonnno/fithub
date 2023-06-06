import { Team } from "./Team";
import { User } from "./User";

export type TeamMember = {
  id: string;
  user_id: string;
  team_id: string;
  owner: number;
  created_at: string;
  user: User;
  team: Team;
};
