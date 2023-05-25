import { NextPage } from "next";

export type AuthNextPage<P = {}, IP = P> = NextPage<P, IP> & {
  requireAuth?: boolean;
};
