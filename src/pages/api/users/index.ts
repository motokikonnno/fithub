import { getUsers } from "@/lib/api/user";
import { HttpMethod } from "@/types/http";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case HttpMethod.GET:
      return getUsers(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
