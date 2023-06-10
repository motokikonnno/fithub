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
    from: { email: "FitHub2023610@gmail.com", name: "FitHub" },
    subject: "Invite team",
    text: "You have received an invitation to the team",
    html: generateMail(
      "You have been invited to the team",
      `Thank you very much for your continued use of FitHub.<br /><br />You have been invited to ${team_name} by ${inviter_name}<br /><br />Please choose whether to join the team by clicking on the link below.`,
      `${FITHUB_DOMAIN}/invitation/${invite_id}`
    ),
  };
  await sgMail.send(msg);
};

const generateMail = (title: string, body: string, link: string) => {
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          background-color: #f7f7f7;
        }
        .container {
          background-color: #ffffff;
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
          border-radius: 15px;
          box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.15);
        }
        h1 {
          color: #445566;
        }
        p {
          color: #445566;
        }
        a {
          display: inline-block;
          padding: 10px 20px;
          margin-top: 20px;
          background-color: #445566;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${title}</h1>
        <p>${body}</p>
        <a href=${link}>Click Here</a>
      </div>
    </body>
  </html>`;
};
