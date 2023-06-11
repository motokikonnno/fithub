import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../prisma";

export async function getFile(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<void>> {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid user_id not string type" });
  }

  try {
    const file = await prisma.file.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
        commits: {
          include: {
            user: true,
          },
        },
        current_commits: true,
      },
    });
    return res.status(200).json({ file: file });
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function createFile(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<void>> {
  const { name, repository_id, parent_id, user_id } = req.body;

  try {
    const response = await prisma.file.create({
      data: {
        name,
        repository_id,
        parent_id,
        user_id,
      },
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function updateFile(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<void>> {
  const { id, name } = req.body;
  try {
    const response = await prisma.file.update({
      where: {
        id: id,
      },
      data: {
        name,
      },
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function deleteFile(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<void>> {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid user_id not string type" });
  }

  try {
    const response = await prisma.file.delete({
      where: {
        id: id,
      },
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).end(error);
  }
}
