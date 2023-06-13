import {
  folderRepository,
  FolderRepository,
} from "@/repositories/FolderRepository";
import { Repository } from "./Repository";
import { User } from "./User";

export type Folder = {
  id: string;
  name: string;
  parent_id: string;
  created_at: string;
  repository_id: string;
  user_id: string;
  repository: Repository;
  user: User;
};

export const folderFactory = (rep?: FolderRepository) => {
  const repository = rep ?? folderRepository;
  return {
    index: async (id: string, parent_id: string): Promise<Folder[]> => {
      const folders = repository.getFolders(id, parent_id);
      return folders;
    },
    create: async (
      params: Pick<Folder, "name" | "parent_id" | "user_id" | "repository_id">
    ): Promise<void> => {
      await repository.createFolder(params);
    },
    update: async (params: Pick<Folder, "id" | "name">): Promise<void> => {
      await repository.updateFolder(params);
    },
    delete: async (id: string): Promise<void> => {
      await repository.deleteFolder(id);
    },
  };
};
