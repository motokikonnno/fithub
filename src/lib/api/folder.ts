import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../prisma";

export async function createFolder(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<void>> {
  const { name, parent_id, repository_id } = req.body;

  try {
    const response = await prisma.folder.create({
      data: {
        name,
        repository_id,
        parent_id,
      },
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function updateFolder(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<void>> {
  const { id, name } = req.body;
  try {
    const response = await prisma.folder.update({
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

export async function deleteFolder(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<void>> {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid user_id not string type" });
  }

  try {
    const response = await prisma.folder.delete({
      where: {
        id: id,
      },
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).end(error);
  }
}