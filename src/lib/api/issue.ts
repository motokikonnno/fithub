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

export async function createIssue(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<{ id: string }>> {
  const { title, issue, repository_id, user_id } = req.body;

  try {
    const issueData = await prisma.issue.create({
      data: {
        title,
        issue,
        user_id,
        repository_id,
      },
    });
    return res.status(200).json({ id: issueData.id });
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
