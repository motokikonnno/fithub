import { Repository } from "@/models/Repository";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../prisma";

export async function getAllRepositories(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Repository>> {
  try {
    const repositories = await prisma.repository.findMany({
      select: {
        id: true,
        user_id: true,
        name: true,
        description: true,
        is_private: true,
        is_read_me: true,
        read_me: true,
        created_at: true,
      },
    });
    return res.status(200).json({ repositories: repositories });
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function getRepositories(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Repository>> {
  const { user_id } = req.query;

  if (typeof user_id !== "string") {
    return res.status(400).json({ error: "Invalid user_id not string type" });
  }

  try {
    const repositories = await prisma.repository.findMany({
      where: {
        user_id: user_id,
      },
      select: {
        id: true,
        user_id: true,
        name: true,
        description: true,
        is_private: true,
        is_read_me: true,
        read_me: true,
        created_at: true,
      },
    });
    return res.status(200).json({ repositories: repositories });
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function getRepository(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Repository>> {
  const { id, user_id } = req.query;

  const repositoryId = String(id);
  const userId = String(user_id);

  try {
    const repository = await prisma.repository.findFirst({
      where: {
        id: repositoryId,
        user_id: userId,
      },
      select: {
        id: true,
        user_id: true,
        name: true,
        description: true,
        is_private: true,
        is_read_me: true,
        read_me: true,
        created_at: true,
      },
    });
    return res.status(200).json({ repository: repository });
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function createRepository(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<void>> {
  const { user_id, name, description, is_private, read_me, is_read_me } =
    req.body;
  try {
    const response = await prisma.repository.create({
      data: {
        user_id,
        name,
        description,
        is_private,
        read_me,
        is_read_me,
      },
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).end(error);
  }
}
