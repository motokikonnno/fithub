import { Invite, inviteFactory } from "@/models/Invite";
import { teamMemberFactory } from "@/models/TeamMember";
import ErrorPage from "@/pages/404";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC } from "react";
import styles from "../../styles/components/pages/InviteConfirm.module.scss";
import { SEO } from "../SEO";

export type InviteConfirmProps = {
  inviteData: Invite;
};

export const InviteConfirm: FC<InviteConfirmProps> = ({ inviteData }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleAcceptInvitation = async () => {
    if (session?.user)
      await teamMemberFactory().create({
        team_id: inviteData.team_id,
        user_id: session?.user.id,
      });
    await inviteFactory().delete(inviteData.id);
    router.push(`/team/${inviteData.team_id}`);
  };

  const handleCancelInvitation = async () => {
    await inviteFactory().delete(inviteData.id);
    router.push("/");
  };

  if (
    !inviteData ||
    (session && session.user.email !== inviteData.invitee_email)
  ) {
    return <ErrorPage isSession={true} />;
  }

  return (
    <>
      <SEO title={"invite"} url={router.asPath} />
      <div className={styles.elem}>
        <div className={styles.inner}>
          <div className={styles.layoutContainer}>
            <Image
              src={session ? inviteData.team.image : "/logo.png"}
              width={64}
              height={64}
              alt="logo-icon"
              className={styles.logoIcon}
            />
            <h1 className={styles.title}>
              {session
                ? `Do you accept the invitation from the ${inviteData.team.name}?`
                : "Sign in to FitHub"}
            </h1>
            {session ? (
              <div className={styles.actionContainer}>
                <div
                  className={styles.acceptButton}
                  onClick={handleAcceptInvitation}
                >
                  Accept
                </div>
                <div
                  className={styles.cancelButton}
                  onClick={handleCancelInvitation}
                >
                  Cancel
                </div>
              </div>
            ) : (
              <div className={styles.signInButtonContainer}>
                <button
                  className={styles.signInButton}
                  onClick={() =>
                    signIn("google", {
                      callbackUrl: `/invitation/${inviteData.id}`,
                    })
                  }
                >
                  <Image
                    src={`/icons/google.svg`}
                    width={24}
                    height={24}
                    alt="service-icon"
                    className={styles.serviceIcon}
                  />
                  Sign in with Google
                </button>
                <button
                  className={styles.signInButton}
                  onClick={() =>
                    signIn("github", {
                      callbackUrl: `/invitation/${inviteData.id}`,
                    })
                  }
                >
                  <Image
                    src={`/icons/github.svg`}
                    width={24}
                    height={24}
                    alt="service-icon"
                    className={styles.serviceIcon}
                  />
                  Sign in with GitHub
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
