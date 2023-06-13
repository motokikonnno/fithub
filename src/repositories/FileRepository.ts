import { ApiClient } from "@/lib/api-client";
import { File } from "@/models/File";

export type FileRepository = {
  getFiles: (id: string, parent_id: string) => Promise<File[]>;
  getFile: (id: string) => Promise<File>;
  createFile: (
    params: Pick<File, "name" | "repository_id" | "parent_id" | "user_id">
  ) => Promise<void>;
  updateFile: (params: Pick<File, "id" | "name">) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
};

const getFiles: FileRepository["getFiles"] = async (id, parent_id) => {
  const response = await ApiClient.get(`/repository/${id}/files/${parent_id}`);
  return response.data.files;
};

const getFile: FileRepository["getFile"] = async (id) => {
  const response = await ApiClient.get(`/file/${id}`);
  return response.data.file;
};

const createFile: FileRepository["createFile"] = async (params) => {
  await ApiClient.post("/file", params);
};

const updateFile: FileRepository["updateFile"] = async (params) => {
  await ApiClient.put(`/file/${params.id}`, params);
};

const deleteFile: FileRepository["deleteFile"] = async (id) => {
  await ApiClient.delete(`/file/${id}`);
};

export const fileRepository: FileRepository = {
  getFiles,
  getFile,
  createFile,
  updateFile,
  deleteFile,
};
