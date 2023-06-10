import { ApiClient } from "@/lib/api-client";
import { createInviteInfo, Invite } from "@/models/Invite";

export type InviteRepository = {
  getInvites: () => Promise<Invite[]>;
  getInvite: (id: string) => Promise<Invite>;
  createInvite: (prams: createInviteInfo) => Promise<{ id: string }>;
  deleteInvite: (id: string) => Promise<void>;
};

const getInvites: InviteRepository["getInvites"] = async () => {
  const response = await ApiClient.get(`/invite`);
  return response.data.invites;
};

const getInvite: InviteRepository["getInvite"] = async (id) => {
  const response = await ApiClient.get(`/invite/${id}`);
  return response.data.invite;
};

const createInvite: InviteRepository["createInvite"] = async (params) => {
  const response = await ApiClient.post(`/invite`, params);
  return response.data.id;
};

const deleteInvite: InviteRepository["deleteInvite"] = async (id) => {
  await ApiClient.delete(`/invite/${id}`);
};

export const inviteRepository: InviteRepository = {
  getInvites,
  getInvite,
  createInvite,
  deleteInvite,
};
