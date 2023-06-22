import {
  InviteConfirm,
  InviteConfirmProps,
} from "@/components/pages/InviteConfirm";
import { inviteFactory } from "@/models/Invite";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetServerSideProps } from "next";

type QueryParams = {
  id: string;
};

const InvitePage: AuthNextPage<InviteConfirmProps> = ({ inviteData }) => {
  return <InviteConfirm inviteData={inviteData} />;
};

export default InvitePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { id } = context.query as QueryParams;
    const inviteData = await inviteFactory().show(id);
    return {
      props: { inviteData: inviteData },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
