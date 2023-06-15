import { Loading } from "@/components/Loading";
import { Dashboard, DashboardProps } from "@/components/pages/Dashboard";
import { activityFactory } from "@/models/Activity";
import { userFactory } from "@/models/User";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import ErrorPage from "./404";

const DashboardPage: AuthNextPage<DashboardProps & { session: Session }> = ({
  activities,
  user,
  session,
}) => {
  if (user?.id !== session?.user.id) {
    <ErrorPage isSession={true} />;
  }

  if (user) {
    return <Dashboard user={user} activities={activities} />;
  } else {
    return <Loading />;
  }
};

export default DashboardPage;
DashboardPage.requireAuth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    const user = await userFactory().show(session?.user.id);
    const activities = await activityFactory().index(user.id, 1);
    return {
      props: {
        user: user,
        activities: activities,
        session: session,
      },
    };
  }
  return {
    notFound: true,
  };
};
