export type Commit = {
  id: string;
  message: string;
  commit_user: string;
  created_at: string;
  file_id: string;
  file: File;
};
