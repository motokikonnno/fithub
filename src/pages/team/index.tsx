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
  try {
    const session = await getSession(context);
    if (session) {
      const user = await userFactory().show(session?.user.id);
      return {
        props: { user, session },
      };
    } else {
      return {
        props: {},
      };
    }
  } catch {
    return {
      notFound: true,
    };
  }
};
