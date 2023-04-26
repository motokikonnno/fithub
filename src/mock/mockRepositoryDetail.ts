export type repositoryFolder = {
  id: string;
  name: string;
  parent_id?: string;
  user_id: string;
  updatedAt: string;
};

export type repositoryFile = {
  id: string;
  name: string;
  folder_id: string;
  updatedAt: string;
};

export const mockRepositoryFolder: repositoryFolder[] = [
  {
    id: "1",
    name: "mock",
    parent_id: "",
    user_id: "1",
    updatedAt: "last year",
  },
  {
    id: "2",
    name: "mock2",
    parent_id: "",
    user_id: "1",
    updatedAt: "last year",
  },
  {
    id: "3",
    name: "mock3",
    parent_id: "",
    user_id: "1",
    updatedAt: "last year",
  },
  {
    id: "4",
    name: "mock4",
    parent_id: "1",
    user_id: "1",
    updatedAt: "last year",
  },
  {
    id: "5",
    name: "mock5",
    parent_id: "2",
    user_id: "1",
    updatedAt: "last year",
  },
  {
    id: "6",
    name: "mock6",
    parent_id: "4",
    user_id: "1",
    updatedAt: "last year",
  },
];

export const mockRepositoryFile: repositoryFile[] = [
  {
    id: "1",
    name: "mockFile",
    folder_id: "",
    updatedAt: "last year",
  },
  {
    id: "2",
    name: "mockFile2",
    folder_id: "",
    updatedAt: "last year",
  },
  {
    id: "3",
    name: "mockFile3",
    folder_id: "",
    updatedAt: "last year",
  },
  {
    id: "4",
    name: "mockFile4",
    folder_id: "1",
    updatedAt: "last year",
  },
  {
    id: "5",
    name: "mockFile5",
    folder_id: "1",
    updatedAt: "last year",
  },
  {
    id: "6",
    name: "mockFile6",
    folder_id: "2",
    updatedAt: "last year",
  },
];
