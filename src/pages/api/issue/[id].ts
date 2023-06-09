import { deleteIssue, getIssue, updateIssue } from "@/lib/api/issue";
import { HttpMethod } from "@/types/http";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handleRequest: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case HttpMethod.GET:
      return getIssue(req, res);
    case HttpMethod.PUT:
      return updateIssue(req, res);
    case HttpMethod.DELETE:
      return deleteIssue(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handleRequest;
