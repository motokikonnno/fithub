import { deleteTeamMember } from "@/lib/api/team-member";
import { HttpMethod } from "@/types/http";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handleDeleteTeamMemberRequest: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case HttpMethod.DELETE:
      return deleteTeamMember(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handleDeleteTeamMemberRequest;
