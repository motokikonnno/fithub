import { User } from "@/models/User";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../prisma";

export async function getUsers(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<User[]>> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });
    return res.status(200).json({ users: users });
  } catch (error) {
    return res.status(500).end(error);
  }
}
