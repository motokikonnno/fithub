import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SEND_GRID_API_KEY!);

const FITHUB_DOMAIN = process.env.NEXT_PUBLIC_VERCEL_URL;

export const sendTeamInvitationMail = async (
  invitee_email: string,
  inviter_name: string,
  team_name: string,
  invite_id: string
) => {
  const msg = {
    to: invitee_email,
    from: "FitHub2023610@gmail.com",
    subject: "Team invite",
    text: "You have received an invitation to the team",
    html: generateMail(
      "You have been invited to the team",
      `Thank you very much for your continued use of FitHub.<br /><br />${inviter_name}さんより${team_name}に招待されました。<br /><br />下記のURLリンクよりコミュニティに参加するか選択してください。`,
      `${FITHUB_DOMAIN}/invitation/${invite_id}`
    ),
  };
  await sgMail.send(msg);
};

const generateMail = (title: string, body: string, link: string) => {
  return `${title}${body}${link}`;
};
