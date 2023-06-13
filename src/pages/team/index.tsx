import { TeamList, TeamListProps } from "@/components/pages/TeamList";
import { userFactory } from "@/models/User";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

const TeamListPage: AuthNextPage<TeamListProps> = ({ user }) => {
  return <TeamList user={user} />;
};

export default TeamListPage;
TeamListPage.requireAuth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession();
  if (session) {
    const user = userFactory().show(session?.user.id);
    return {
      props: { user },
    };
  } else {
    return {
      props: {},
    };
  }
};
