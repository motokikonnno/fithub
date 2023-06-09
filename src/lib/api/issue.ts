import { Issue } from "@/models/Issue";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../prisma";

export async function getIssues(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Issue[]>> {
  try {
    const issues = await prisma.issue.findMany({
      select: {
        id: true,
        issue_number: true,
        user_id: true,
        title: true,
        issue: true,
        type: true,
        user: true,
        repository: true,
        created_at: true,
        repository_id: true,
      },
    });
    return res.status(200).json({ issues: issues });
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function getIssue(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Issue>> {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid user_id not string type" });
  }

  try {
    const issue = await prisma.issue.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
        repository: true,
        mention: {
          include: {
            user: true,
          },
        },
      },
    });
    return res.status(200).json({ issue: issue });
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function createIssue(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<{ id: string }>> {
  const { title, issue, repository_id, user_id } = req.body;

  try {
    const repository = await prisma.repository.findUnique({
      where: { id: repository_id },
    });
    if (repository) {
      const issueData = await prisma.issue.create({
        data: {
          title,
          issue,
          issue_number: repository?.next_issue_id,
          user_id,
          repository_id,
        },
      });
      await prisma.repository.update({
        where: { id: repository_id },
        data: {
          next_issue_id: repository.next_issue_id + 1,
        },
      });
      return res.status(200).json({ id: issueData.id });
    }
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function updateIssue(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<void>> {
  const { id, title, issue, type } = req.body;

  try {
    const response = await prisma.issue.update({
      where: {
        id: id,
      },
      data: {
        title,
        issue,
        type,
      },
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function deleteIssue(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<void>> {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid user_id not string type" });
  }

  try {
    const response = await prisma.issue.delete({
      where: {
        id: id,
      },
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).end(error);
  }
}
