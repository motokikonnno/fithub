import { UserBelongsToTeam } from "@/models/User";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../prisma";

export async function getTeamMembers(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<UserBelongsToTeam[]>> {
  const { team_id, search } = req.query;

  const teamId = String(team_id);

  try {
    let members;
    let membersNumber;

    const teamMembers = await prisma.teamMember.findMany({
      where: {
        team_id: teamId,
      },
      select: {
        user_id: true,
      },
    });
    const userIds = teamMembers.map((member) => member.user_id);

    if (search) {
      members = await prisma.user.findMany({
        where: {
          id: {
            in: userIds,
          },
          name: {
            contains: String(search),
          },
        },
        include: {
          team_members: true,
        },
      });
      membersNumber = members.length;
    } else {
      members = await prisma.user.findMany({
        where: {
          id: {
            in: userIds,
          },
        },
        include: {
          team_members: true,
        },
      });
      membersNumber = members.length;
    }
    return res.status(200).json({ members, membersNumber });
  } catch (error) {
    return res.status(500).end(error);
  }
}

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
