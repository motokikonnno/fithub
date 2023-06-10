import {
  inviteRepository,
  InviteRepository,
} from "@/repositories/InviteRepository";
import { Team } from "./Team";

export type Invite = {
  id: string;
  invitee_email: string;
  inviter_name: string;
  team: Team;
  created_at: string;
  team_id: string;
};

export type createInviteInfo = {
  invitee_email: string;
  inviter_name: string;
  team_id: string;
};

export const inviteFactory = (rep?: InviteRepository) => {
  const repository = rep ?? inviteRepository;
  return {
    index: async (): Promise<Invite[]> => {
      const invites = await repository.getInvites();
      return invites;
    },
    show: async (id: string): Promise<Invite> => {
      const invite = await repository.getInvite(id);
      return invite;
    },
    create: async (params: createInviteInfo): Promise<{ id: string }> => {
      const invite = await repository.createInvite(params);
      return invite;
    },
    delete: async (id: string): Promise<void> => {
      await repository.deleteInvite(id);
    },
  };
};
