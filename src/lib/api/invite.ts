import { Invite } from "@/models/Invite";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../prisma";
import { sendTeamInvitationMail } from "./send-grid";

export async function getInvites(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Invite[]>> {
  try {
    const invites = await prisma.teamInvitation.findMany({
      include: {
        team: true,
      },
    });
    return res.status(200).json({ invites: invites });
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function getInvite(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Invite>> {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid user_id not string type" });
  }

  try {
    const invite = await prisma.teamInvitation.findUnique({
      where: {
        id: id,
      },
      include: {
        team: true,
      },
    });
    return res.status(200).json({ invite: invite });
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function createInvite(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<{ id: string }>> {
  const { invitee_email, inviter_name, team_id } = req.body;

  try {
    const invite = await prisma.teamInvitation.create({
      data: {
        invitee_email,
        inviter_name,
        team_id,
      },
    });
    const team = await prisma.team.findUnique({
      where: {
        id: team_id,
      },
    });

    if (team)
      await sendTeamInvitationMail(
        invitee_email,
        inviter_name,
        team.name,
        invite.id
      );
    return res.status(200).json({ id: invite.team_id });
  } catch (error) {
    return res.status(500).end(error);
  }
}

export async function deleteInvite(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<void>> {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid user_id not string type" });
  }

  try {
    const invite = await prisma.teamInvitation.delete({
      where: {
        id: id,
      },
    });
    return res.status(200).json(invite);
  } catch (error) {
    return res.status(500).end(error);
  }
}
