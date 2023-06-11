import { Count } from "@/models/Count";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../prisma";

export async function countBodyParts(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Count>> {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid user_id not string type" });
  }

  try {
    const repository = await prisma.repository.findUnique({
      where: {
        id: id,
      },
      include: {
        commits: true,
      },
    });

    if (repository) {
      const totalCommits = repository.commits.length;
      const typeCounts: Count = repository.commits.reduce(
        (counts: Count, commit) => {
          const key = commit.body_parts;
          if (key >= 1 && key <= 7) {
            const count = counts[key];
            if (count !== undefined) {
              counts[key] = count + 1;
            } else {
              counts[key] = 1;
            }
          }
          return counts;
        },
        {} as Count
      );

      const typePercentages: Count = Object.fromEntries(
        Object.entries(typeCounts).map(([key, value]) => [
          key,
          ((value ?? 0) / totalCommits) * 100,
        ])
      );
      return res.status(200).json({ typeCounts: typePercentages });
    }
  } catch (error) {
    return res.status(500).end(error);
  }
}
