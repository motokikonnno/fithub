import { ApiClient } from "@/lib/api-client";
import { User } from "@/models/User";

export type UserRepository = {
  getUsers: () => Promise<User[]>;
  getUser: (id?: string) => Promise<User>;
  updateUser: (params: User) => Promise<void>;
};

const getUsers: UserRepository["getUsers"] = async () => {
  const response = await ApiClient.get(`/users`);
  return response.data.users;
};

const getUser: UserRepository["getUser"] = async (id) => {
  const response = await ApiClient.get(`/users/${id}`);
  return response.data.user;
};

const updateUser: UserRepository["updateUser"] = async (params) => {
  const response = await ApiClient.put(`/users/${params.id}`);
  return response.data.user;
};

export const userRepository: UserRepository = {
  getUsers,
  getUser,
  updateUser,
};
