import { Loading } from "@/components/Loading";
import {
  InviteConfirm,
  InviteConfirmProps,
} from "@/components/pages/InviteConfirm";
import { inviteFactory } from "@/models/Invite";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ErrorPage from "../404";

type PathParams = {
  id: string;
};

const InvitePage: AuthNextPage<InviteConfirmProps> = ({ inviteData }) => {
  const router = useRouter();
  const { data: session } = useSession();
  // if (router.isFallback) {
  //   return <Loading />;
  // }
  // if (session?.user.email === inviteData.invitee_email) {
  return <InviteConfirm inviteData={inviteData} />;
  // } else {
  //   return <ErrorPage />;
  // }
};

export default InvitePage;
// InvitePage.requireAuth = true;

export const getStaticPaths: GetStaticPaths = async () => {
  const invites = await inviteFactory().index();
  const paths = invites.map(({ id }) => ({
    params: { id: id },
  }));
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as PathParams;
  try {
    const inviteData = await inviteFactory().show(id);
    return {
      props: { inviteData: inviteData },
    };
  } catch {
    return {
      notFound: true,
      revalidate: 60,
    };
  }
};
