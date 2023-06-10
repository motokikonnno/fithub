import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../prisma";

export async function createTeamMember(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<void>> {
  const { team_id, user_id } = req.body;

  try {
    const response = await prisma.teamMember.create({
      data: {
        team_id: team_id,
        user_id: user_id,
      },
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function deleteTeamMember(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<void>> {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid user_id not string type" });
  }

  try {
    const response = await prisma.teamMember.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).end(error);
  }
}
