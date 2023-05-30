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

export async function getUser(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<User>> {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid user_id not string type" });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
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
): Promise<void | NextApiResponse<void>> {
  const { user_id, name, email, image, bio } = req.body;
  try {
    const response = await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        name,
        bio,
        email,
        image,
      },
    });
    return res.status(201).json({
      userId: response.id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).end(error);
  }
}
