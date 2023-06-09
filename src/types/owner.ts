import { Repository } from "@/models/Repository";
import { TeamMember } from "@/models/TeamMember";

export type Owner = {
  id: string;
  name: string | undefined;
  image: string | undefined;
  type: "user" | "team";
};

export type OwnerWithRepositories = Owner & {
  repositories: Repository[] | undefined;
};
