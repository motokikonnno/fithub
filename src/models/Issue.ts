import { Repository } from "./Repository";

export type Issue = {
  id: number;
  title: string;
  issue: string;
  created_at: string;
  updated_at: string;
  repository_id: string;
  user_id: string;
  repository: Repository;
};
