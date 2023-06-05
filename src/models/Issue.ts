import {
  issueRepository,
  IssueRepository,
} from "@/repositories/IssueRepository";
import { Repository } from "./Repository";
import { User } from "./User";

export type Issue = {
  id: number;
  title: string;
  issue: string;
  type: string;
  created_at: string;
  repository_id: string;
  user_id: string;
  repository: Repository;
  user: User;
};

export type updateIssue = {
  id: number;
  title?: string;
  issue?: string;
  type?: string;
};

export const issueFactory = (rep?: IssueRepository) => {
  const repository = rep ?? issueRepository;
  return {
    index: async (): Promise<Issue[]> => {
      const issues = await repository.getIssues();
      return issues;
    },
    show: async (id: string): Promise<Issue> => {
      const issue = await repository.getIssue(id);
      return issue;
    },
    create: async (
      params: Omit<Issue, "id" | "created_at" | "user" | "repository" | "type">
    ): Promise<{ id: string } | void> => {
      const issue = await repository.createIssue(params);
      return issue;
    },
    update: async (params: updateIssue): Promise<void> => {
      const issue = await repository.updateIssue(params);
      return issue;
    },
    delete: async (id: string): Promise<void> => {
      await repository.deleteIssue(id);
    },
  };
};
