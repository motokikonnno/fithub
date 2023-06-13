import { getTeam, updateTeam } from "@/lib/api/team";
import { HttpMethod } from "@/types/http";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handleRequest: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case HttpMethod.GET:
      return getTeam(req, res);
    case HttpMethod.PUT:
      return updateTeam(req, res);
    case HttpMethod.DELETE:
    // return deleteTeam(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handleRequest;
