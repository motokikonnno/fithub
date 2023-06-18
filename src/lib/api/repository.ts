import { Repository } from "@/models/Repository";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../prisma";

const NUM_REPOSITORIES_PER_PAGE = 8;

export async function getRepositories(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Repository[] & { totalNumber: number }>> {
  const { isPrivate, type, owner_id, page, search } = req.query;

  try {
    let repositories;
    let count;
    if (search) {
      if (type === "user") {
        repositories = await prisma.repository.findMany({
          where: {
            user_id: String(owner_id),
            is_private: {
              in: isPrivate ? [1, 2] : [1],
            },
            name: {
              contains: String(search),
            },
          },
          orderBy: {
            created_at: "desc",
          },
          include: {
            commits: true,
          },
        });
        const allRepositories = await prisma.repository.findMany({
          where: {
            user_id: String(owner_id),
          },
        });
        count = allRepositories.length;
      } else if (type === "team") {
        repositories = await prisma.repository.findMany({
          where: {
            team_id: String(owner_id),
            is_private: {
              in: isPrivate ? [1, 2] : [1],
            },
            name: {
              contains: String(search),
            },
          },
          orderBy: {
            created_at: "desc",
          },
        });
      }
      const allRepositories = await prisma.repository.findMany({
        where: {
          team_id: String(owner_id),
        },
      });
      count = allRepositories.length;
    } else {
      const skip = (Number(page) - 1) * NUM_REPOSITORIES_PER_PAGE;
      if (type === "user") {
        repositories = await prisma.repository.findMany({
          where: {
            user_id: String(owner_id),
            is_private: {
              in: isPrivate ? [1, 2] : [1],
            },
          },
          orderBy: {
            created_at: "desc",
          },
          skip,
          take: NUM_REPOSITORIES_PER_PAGE,
        });
        const allRepositories = await prisma.repository.findMany({
          where: {
            user_id: String(owner_id),
          },
        });
        count = allRepositories.length;
      } else if (type === "team") {
        repositories = await prisma.repository.findMany({
          where: {
            team_id: String(owner_id),
            is_private: {
              in: isPrivate ? [1, 2] : [1],
            },
          },
          orderBy: {
            created_at: "desc",
          },
          skip,
          take: NUM_REPOSITORIES_PER_PAGE,
        });
        const allRepositories = await prisma.repository.findMany({
          where: {
            team_id: String(owner_id),
          },
        });
        count = allRepositories.length;
      }
    }
    return res
      .status(200)
      .json({ repositories: repositories, totalNumber: count });
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function getRepository(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Repository>> {
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
        issues: {
          include: {
            user: true,
          },
        },
        commits: {
          include: {
            user: true,
          },
        },
        user: true,
        files: {
          include: {
            commits: true,
            current_commits: true,
          },
        },
        folders: true,
        team: {
          include: {
            team_members: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
    return res.status(200).json({ repository: repository });
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function createRepository(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<{ id: string }>> {
  const {
    user_id,
    name,
    description,
    is_private,
    read_me,
    is_read_me,
    team_id,
  } = req.body;

  try {
    let repository;

    if (user_id) {
      repository = await prisma.repository.create({
        data: {
          user: {
            connect: { id: user_id },
          },
          name,
          description,
          is_private,
          read_me,
          is_read_me,
        },
      });
    } else {
      repository = await prisma.repository.create({
        data: {
          team: {
            connect: { id: team_id },
          },
          name,
          description,
          is_private,
          read_me,
          is_read_me,
        },
      });
    }

    return res.status(200).json({ id: repository.id });
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function updateRepository(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<
  Pick<Repository, "id" | "is_read_me" | "read_me">
>> {
  const { id, read_me, is_read_me } = req.body;
  try {
    const repository = await prisma.repository.update({
      where: {
        id: id,
      },
      data: {
        read_me,
        is_read_me,
      },
    });
    return res.status(200).json({ repository: repository });
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function deleteRepository(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<void>> {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid user_id not string type" });
  }

  try {
    const repository = await prisma.repository.delete({
      where: {
        id: id,
      },
    });
    return res.status(200).json(repository);
  } catch (error) {
    return res.status(500).end(error);
  }
}
