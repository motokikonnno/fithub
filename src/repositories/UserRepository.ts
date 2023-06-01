import { ApiClient } from "@/lib/api-client";
import { User } from "@/models/User";

export type UserRepository = {
  getUsers: () => Promise<User[]>;
  getUser: (user_id: string) => Promise<User>;
  updateUser: (params: User) => Promise<User>;
};

const getUsers: UserRepository["getUsers"] = async () => {
  const response = await ApiClient.get(`/user`);
  return response.data.users;
};

const getUser: UserRepository["getUser"] = async (user_id) => {
  const response = await ApiClient.get(`/user/${user_id}`);
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
