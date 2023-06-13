import { ApiClient } from "@/lib/api-client";
import { Folder } from "@/models/Folder";

export type FolderRepository = {
  getFolders: (id: string, parent_id: string) => Promise<Folder[]>;
  createFolder: (
    params: Pick<Folder, "name" | "parent_id" | "user_id" | "repository_id">
  ) => Promise<void>;
  updateFolder: (params: Pick<Folder, "id" | "name">) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
};

const getFolders: FolderRepository["getFolders"] = async (id, parent_id) => {
  const response = await ApiClient.get(
    `/repository/${id}/folders/${parent_id}`
  );
  return response.data.folders;
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
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
};
