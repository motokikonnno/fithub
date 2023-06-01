import { Repository } from "./Repository";
import { TeamMember } from "./TeamMember";

export type Team = {
  id: string;
  name: string;
  bio: string;
  image: string;
  created_at: string;
  repositories?: Repository[];
  team_members?: TeamMember[];
};
