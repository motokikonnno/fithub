import { deleteFolder, updateFolder } from "@/lib/api/folder";
import { HttpMethod } from "@/types/http";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handleFolderRequest: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case HttpMethod.DELETE:
      return deleteFolder(req, res);
    case HttpMethod.PUT:
      return updateFolder(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handleFolderRequest;
