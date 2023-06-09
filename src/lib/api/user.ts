import { User } from "@/models/User";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../prisma";

export async function getUser(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<User>> {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid user_id not string type" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        repositories: true,
        team_members: {
          include: {
            team: {
              include: {
                repositories: true,
              },
            },
          },
        },
        commits: true,
      },
    });
    return res.status(200).json({ user: user });
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function updateUser(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<User>> {
  const { id, name, image, bio } = req.body;
  try {
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name,
        bio,
        image,
      },
    });
    return res.status(200).json({ user: user });
  } catch (error) {
    return res.status(500).end(error);
  }
}
