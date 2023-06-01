import { Commit } from "./Commit";

export type CurrentCommit = Omit<Commit, "commit_user">;
