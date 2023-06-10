import { deleteInvite, getInvite } from "@/lib/api/invite";
import { HttpMethod } from "@/types/http";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handleInviteRequest: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case HttpMethod.GET:
      return getInvite(req, res);
    case HttpMethod.DELETE:
      return deleteInvite(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handleInviteRequest;
