import { Dashboard, DashboardProps } from "@/components/pages/Dashboard";
import { userFactory } from "@/models/User";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import ErrorPage from "./404";

const DashboardPage: AuthNextPage<DashboardProps & { session: Session }> = ({
  user,
  session,
}) => {
  if (user?.id !== session?.user.id) {
    <ErrorPage isSession={true} />;
  }

  return <Dashboard user={user} />;
};

export default DashboardPage;
DashboardPage.requireAuth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    const user = await userFactory().show(session?.user.id);
    return {
      props: {
        user: user,
        session: session,
      },
    };
  }
  return {
    notFound: true,
  };
};
