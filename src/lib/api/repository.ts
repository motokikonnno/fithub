import { Repository } from "@/models/Repository";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../prisma";

export async function getRepositories(
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

export async function getRepository(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Repository>> {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid user_id not string type" });
  }

  try {
    const repository = await prisma.repository.findFirst({
      where: {
        id: id,
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
        folders: true,
        files: true,
        issues: true,
        user: true,
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
): Promise<void | NextApiResponse<{ id: string }>> {
  const { user_id, name, description, is_private, read_me, is_read_me } =
    req.body;
  try {
    const repository = await prisma.repository.create({
      data: {
        user_id,
        name,
        description,
        is_private,
        read_me,
        is_read_me,
      },
    });
    return res.status(200).json({ id: repository.id });
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function updateRepository(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<
  Pick<Repository, "id" | "is_read_me" | "read_me">
>> {
  const { id, read_me, is_read_me } = req.body;
  try {
    const repository = await prisma.repository.update({
      where: {
        id: id,
      },
      data: {
        read_me,
        is_read_me,
      },
    });
    return res.status(200).json({ repository: repository });
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function deleteRepository(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<void>> {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid user_id not string type" });
  }

  try {
    const repository = await prisma.repository.delete({
      where: {
        id: id,
      },
    });
    return res.status(200).json(repository);
  } catch (error) {
    return res.status(500).end(error);
  }
}
