import { createRepository, getRepository } from "@/lib/api/repository";
import { HttpMethod } from "@/types/http";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handleRepositoryAllRequest: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case HttpMethod.GET:
      return getRepository(req, res);
    case HttpMethod.POST:
      return createRepository(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handleRepositoryAllRequest;
