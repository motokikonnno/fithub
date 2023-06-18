import { Calender } from "@/models/Calender";
import { formatDateCalender } from "@/utils/getTime";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../prisma";

export async function getCalender(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Calender[]>> {
  const { user_id } = req.query;

  if (typeof user_id !== "string") {
    return res.status(400).json({ error: "Invalid user_id not string type" });
  }

  try {
    const commits = await prisma.commit.findMany({
      where: {
        user_id: user_id,
      },
    });

    const commitMap = new Map<string, number>();

    for (let commit of commits) {
      const dateStr = formatDateCalender(`${commit.created_at}`);
      const commitCountForDate = commitMap.get(dateStr) || 0;
      commitMap.set(dateStr, commitCountForDate + 1);
    }

    const commitCounts: Calender[] = [];

    for (let [date, count] of Array.from(commitMap.entries())) {
      let counted: number;
      if (count >= 10) {
        counted = 4;
      } else if (count >= 7) {
        counted = 3;
      } else if (count >= 4) {
        counted = 2;
      } else {
        counted = 1;
      }

      commitCounts.push({ date, count: counted, commitNumber: count });
    }

    return res.status(200).json({ commitCounts });
  } catch (error) {
    return res.status(500).end(error);
  }
}
