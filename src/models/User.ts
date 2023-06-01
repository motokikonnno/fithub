import { userRepository, UserRepository } from "@/repositories/UserRepository";
import { Repository } from "./Repository";
import { TeamMember } from "./TeamMember";

export type User = {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  bio?: string;
  repositories?: Repository[];
  team_members?: TeamMember[];
};

export const userFactory = (rep?: UserRepository) => {
  const repository = rep ?? userRepository;
  return {
    index: async (): Promise<User[]> => {
      const users = await repository.getUsers();
      return users;
    },
    show: async (id: string): Promise<User> => {
      const user = await repository.getUser(id);
      return user;
    },
    update: async (params: User): Promise<User> => {
      const user = await repository.updateUser(params);
      return user;
    },
  };
};
