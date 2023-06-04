import { ApiClient } from "@/lib/api-client";
import { Folder } from "@/models/Folder";

export type FolderRepository = {
  createFolder: (
    params: Omit<Folder, "id" | "created_at" | "files" | "repository">
  ) => Promise<void>;
  updateFolder: (params: Pick<Folder, "id" | "name">) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
};

const createFolder: FolderRepository["createFolder"] = async (params) => {
  await ApiClient.post(`/folder`, params);
};

const updateFolder: FolderRepository["updateFolder"] = async (params) => {
  await ApiClient.put(`/folder/${params.id}`, params);
};

const deleteFolder: FolderRepository["deleteFolder"] = async (id) => {
  await ApiClient.delete(`/folder/${id}`);
};

export const folderRepository: FolderRepository = {
  createFolder,
  updateFolder,
  deleteFolder,
};