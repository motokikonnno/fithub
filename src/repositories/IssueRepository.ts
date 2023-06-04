import { ApiClient } from "@/lib/api-client";
import { Issue, updateIssue } from "@/models/Issue";

export type IssueRepository = {
  getIssues: () => Promise<Issue[]>;
  createIssue: (
    params: Omit<Issue, "id" | "created_at" | "user" | "repository" | "type">
  ) => Promise<{ id: string }>;
  updateIssue: (prams: updateIssue) => Promise<void>;
};

const getIssues: IssueRepository["getIssues"] = async () => {
  const response = await ApiClient.get(`/issue`);
  return response.data.issues;
};

const createIssue: IssueRepository["createIssue"] = async (params) => {
  const response = await ApiClient.post(`/issue`, params);
  return response.data.id;
};

const updateIssue: IssueRepository["updateIssue"] = async (params) => {
  await ApiClient.put(`/issue/${params.id}`, params);
};

export const issueRepository: IssueRepository = {
  getIssues,
  createIssue,
  updateIssue,
};
