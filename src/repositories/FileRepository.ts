import { ApiClient } from "@/lib/api-client";
import { File } from "@/models/File";

export type FileRepository = {
  createFile: (
    params: Pick<File, "name" | "repository_id" | "parent_id">
  ) => Promise<void>;
  updateFile: (params: Pick<File, "id" | "name">) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
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
  createFile,
  updateFile,
  deleteFile,
};
