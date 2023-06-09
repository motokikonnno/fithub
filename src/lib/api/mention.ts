import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../prisma";

export async function updateMention(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<void>> {
  const { id } = req.query;
  const { issue_id, mentioner_id, mentioned_user_id } = req.body;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid user_id not string type" });
  }

  try {
    const response = await prisma.mention.upsert({
      where: { issue_id: id },
      update: {
        mentioned_user_id,
        mentioner_id,
      },
      create: {
        mentioner_id,
        issue_id,
        mentioned_user_id,
      },
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).end(error);
  }
}
