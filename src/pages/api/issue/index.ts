import { createIssue } from "@/lib/api/issue";
import { HttpMethod } from "@/types/http";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handleCreateIssueRequest: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case HttpMethod.POST:
      return createIssue(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handleCreateIssueRequest;
