import { deleteFile, updateFile } from "@/lib/api/file";
import { HttpMethod } from "@/types/http";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handleFileRequest: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case HttpMethod.DELETE:
      return deleteFile(req, res);
    case HttpMethod.PUT:
      return updateFile(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handleFileRequest;
