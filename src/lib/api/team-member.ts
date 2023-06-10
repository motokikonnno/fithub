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
