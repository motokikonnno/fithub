import { Commit } from "./Commit";
import { CurrentCommit } from "./CurrentCommit";
import { Folder } from "./Folder";
import { Repository } from "./Repository";

export type File = {
  id: string;
  name: string;
  created_at: string;
  folder_id?: string;
  repository_id?: string;
  folder: Folder;
  repository: Repository;
  commits?: Commit[];
  current_commits?: CurrentCommit[];
};
