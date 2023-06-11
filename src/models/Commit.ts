import { Repository } from "./Repository";
import { Team } from "./Team";
import { UserBelongsToTeam } from "./User";

export type Commit = {
  id: string;
  message: string;
  body_parts: number;
  created_at: string;
  file_id: string;
  user_id: string;
  team_id?: string;
  repository_id: string;
  file: File;
  user: UserBelongsToTeam;
  team?: Team;
  repository: Repository;
};
