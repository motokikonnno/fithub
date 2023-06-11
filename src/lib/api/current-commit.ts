import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../prisma";

export async function createCurrentCommit(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<void>> {
  const { message, body_parts, file_id, user_id } = req.body;

  try {
    const response = await prisma.currentCommit.create({
      data: {
        message,
        body_parts,
        file_id,
        user_id,
      },
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function deleteCurrentCommit(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<void>> {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid user_id not string type" });
  }

  try {
    const response = await prisma.currentCommit.delete({
      where: {
        id: id,
      },
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).end(error);
  }
}
