import { ApiClient } from "@/lib/api-client";
import { User, UserBelongsToTeam } from "@/models/User";

export type UserRepository = {
  getUsers: () => Promise<User[]>;
  getUser: (id: string) => Promise<UserBelongsToTeam>;
  updateUser: (params: Omit<User, "email">) => Promise<User>;
};

const getUsers: UserRepository["getUsers"] = async () => {
  const response = await ApiClient.get(`/user`);
  return response.data.users;
};

const getUser: UserRepository["getUser"] = async (id) => {
  const response = await ApiClient.get(`/user/${id}`);
  return response.data.user;
};

const updateUser: UserRepository["updateUser"] = async (params) => {
  const response = await ApiClient.put(`/user/${params.id}`, params);
  return response.data.user;
};

export const userRepository: UserRepository = {
  getUsers,
  getUser,
  updateUser,
};
