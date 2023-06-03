import {
  folderRepository,
  FolderRepository,
} from "@/repositories/FolderRepository";
import { Repository } from "./Repository";

export type Folder = {
  id: string;
  name: string;
  parent_id: string;
  created_at: string;
  repository_id: string;
  repository: Repository;
};

export const folderFactory = (rep?: FolderRepository) => {
  const repository = rep ?? folderRepository;
  return {
    create: async (
      params: Omit<Folder, "id" | "created_at" | "files" | "repository">
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
