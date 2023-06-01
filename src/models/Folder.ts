import { Repository } from "./Repository";

export type Folder = {
  id: string;
  name: string;
  parent_id: string;
  created_at: string;
  repository: Repository[];
  files?: File[];
};
