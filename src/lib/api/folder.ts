import { Folder } from "@/models/Folder";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../prisma";

export async function getFolders(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Folder[]>> {
  const { parent_id, id } = req.query;

  if (typeof parent_id !== "string" || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid user_id not string type" });
  }

  const parentId = parent_id.split("_")[1] || "";

  try {
    const folders = await prisma.folder.findMany({
      where: {
        parent_id: parentId,
        repository_id: id,
      },
    });
    return res.status(200).json({ folders: folders });
  } catch (error) {
    res.status(500).end(error);
  }
}

export async function createFolder(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<void>> {
  const { name, parent_id, repository_id, user_id } = req.body;

  try {
    const response = await prisma.folder.create({
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
