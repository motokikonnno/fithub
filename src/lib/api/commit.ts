import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../prisma";

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

      return res.status(200).json(response);
    }
  } catch (error) {
    return res.status(500).end(error);
  }
}
