import { Activity } from "@/models/Activity";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../prisma";

export async function getActivities(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Activity[]>> {
  const { user_id } = req.query;

  if (typeof user_id !== "string") {
    return res.status(400).json({ error: "Invalid user_id not string type" });
  }

  try {
    const activities = await prisma.activity.findMany({
      where: {
        user_id: user_id,
      },
    });
    return res.status(200).json({ activities: activities });
  } catch (error) {
    return res.status(500).end(error);
  }
}
