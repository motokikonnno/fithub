import {
  deleteRepository,
  getRepository,
  updateRepository,
} from "@/lib/api/repository";
import { HttpMethod } from "@/types/http";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handleRequest: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case HttpMethod.GET:
      return getRepository(req, res);
    case HttpMethod.PUT:
      return updateRepository(req, res);
    case HttpMethod.DELETE:
      return deleteRepository(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handleRequest;
