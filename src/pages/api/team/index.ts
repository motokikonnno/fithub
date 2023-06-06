import { createTeam, getTeams } from "@/lib/api/team";
import { HttpMethod } from "@/types/http";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handleTeamsRequest: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case HttpMethod.GET:
      return getTeams(req, res);
    case HttpMethod.POST:
      return createTeam(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handleTeamsRequest;
