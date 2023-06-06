import { Team } from "@/models/Team";
import { NextApiRequest, NextApiResponse } from "next";
import { TRUE } from "sass";
import prisma from "../prisma";

export async function getTeams(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Team[]>> {
  try {
    const teams = await prisma.team.findMany({
      select: {
        id: true,
        name: true,
        bio: true,
        image: true,
        repositories: true,
        team_members: true,
        commits: true,
      },
    });
    return res.status(200).json({ teams: teams });
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function getTeam(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Team[]>> {
  try {
    const { id } = req.query;

    if (typeof id !== "string") {
      return res.status(400).json({ error: "Invalid user_id not string type" });
    }

    const team = await prisma.team.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        bio: true,
        image: true,
        repositories: true,
        team_members: true,
        commits: true,
      },
    });
    return res.status(200).json({ team: team });
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function createTeam(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<{ id: string }>> {
  const { name, bio, image, user_id } = req.body;

  try {
    const team = await prisma.team.create({
      data: {
        name,
        bio,
        image,
      },
    });

    await prisma.teamMember.create({
      data: {
        team_id: team.id,
        user_id: user_id,
        owner: true,
      },
    });

    return res.status(200).json({ id: team.id });
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function updateTeam(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Team>> {
  const { id, name, bio, image } = req.body;

  try {
    const team = await prisma.team.update({
      where: {
        id: id,
      },
      data: {
        name,
        bio,
        image,
      },
    });
    return res.status(200).json({ team: team });
  } catch (error) {
    return res.status(500).end(error);
  }
}
