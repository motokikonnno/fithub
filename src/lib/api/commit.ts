import { Commit } from "@/models/Commit";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../prisma";

const NUM_COMMITS_PER_PAGE = 10;

export async function getCommits(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Commit[]>> {
  const { id, page: pageIndex } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid user_id not string type" });
  }

  try {
    const take = NUM_COMMITS_PER_PAGE * Number(pageIndex);
    const commits = await prisma.commit.findMany({
      where: {
        file_id: id,
      },
      orderBy: {
        created_at: "desc",
      },
      take,
      include: {
        user: true,
      },
    });

    const commitsData = await prisma.commit.findMany({
      where: {
        file_id: id,
      },
    });

    const totalNumber = commitsData.length;

    return res.status(200).json({ commits, totalNumber });
  } catch (error) {
    return res.status(500).end(error);
  }
}
export async function createCommit(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<void>> {
  const { file_id, user_id } = req.body;

  try {
    const file = await prisma.file.findUnique({
      where: {
        id: file_id,
      },
      include: {
        current_commits: true,
        repository: true,
      },
    });

    const teamId = file?.repository.team_id ? file.repository.team_id : "";

    const commits = file?.current_commits
      .filter((currentCommit) => {
        return currentCommit.user_id === user_id;
      })
      .map((commit) => {
        return {
          team_id: teamId,
          repository_id: file.repository_id,
          user_id: user_id,
          file_id: file_id,
          body_parts: commit.body_parts,
          message: commit.message,
        };
      });

    if (commits) {
      const createManyOperation = prisma.commit.createMany({
        data: commits,
      });

      const deleteOperations = (file?.current_commits || [])
        .filter((currentCommit) => {
          return currentCommit.user_id === user_id;
        })
        .map(({ id }) =>
          prisma.currentCommit.delete({
            where: { id },
          })
        );

      const response = await prisma.$transaction([
        createManyOperation,
        ...deleteOperations,
      ]);

      if (teamId !== "") {
        const user = await prisma.user.findUnique({
          where: {
            id: user_id,
          },
        });
        const team = await prisma.team.findUnique({
          where: {
            id: teamId,
          },
          include: {
            team_members: true,
          },
        });
        team &&
          team.team_members.map(async ({ user_id }) => {
            await prisma.activity.create({
              data: {
                user_id: user_id,
                body: `${user?.name} merged the ${file?.repository.name} repository`,
              },
            });
          });
      } else {
        await prisma.activity.create({
          data: {
            user_id: user_id,
            body: `I merged the ${file?.repository.name} repository`,
          },
        });
      }

      return res.status(200).json(response);
    }
  } catch (error) {
    return res.status(500).end(error);
  }
}
