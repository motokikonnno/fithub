import { ApiClient } from "@/lib/api-client";
import { Issue, updateIssue } from "@/models/Issue";

export type IssueRepository = {
  getIssues: () => Promise<Issue[]>;
  getIssue: (id: string) => Promise<Issue>;
  createIssue: (
    params: Omit<Issue, "id" | "created_at" | "user" | "repository" | "type">
  ) => Promise<{ id: string }>;
  updateIssue: (prams: updateIssue) => Promise<void>;
  deleteIssue: (id: string) => Promise<void>;
};

const getIssues: IssueRepository["getIssues"] = async () => {
  const response = await ApiClient.get(`/issue`);
  return response.data.issues;
};

const getIssue: IssueRepository["getIssue"] = async (id) => {
  const response = await ApiClient.get(`/issue/${id}`);
  return response.data.issue;
};

const createIssue: IssueRepository["createIssue"] = async (params) => {
  const response = await ApiClient.post(`/issue`, params);
  return response.data.id;
};

const updateIssue: IssueRepository["updateIssue"] = async (params) => {
  await ApiClient.put(`/issue/${params.id}`, params);
};

const deleteIssue: IssueRepository["deleteIssue"] = async (id) => {
  await ApiClient.delete(`/issue/${id}`);
};

export const issueRepository: IssueRepository = {
  getIssues,
  getIssue,
  createIssue,
  updateIssue,
  deleteIssue,
};
