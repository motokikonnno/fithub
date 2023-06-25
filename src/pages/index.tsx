import { Dashboard, DashboardProps } from "@/components/pages/Dashboard";
import { calenderFactory } from "@/models/Calender";
import { userFactory } from "@/models/User";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import ErrorPage from "./404";

const DashboardPage: AuthNextPage<DashboardProps & { session: Session }> = ({
  user,
  session,
  calender,
}) => {
  if (user?.id !== session?.user.id) {
    <ErrorPage isSession={true} />;
  }

  return <Dashboard user={user} calender={calender} />;
};

export default DashboardPage;
DashboardPage.requireAuth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    const user = await userFactory().show(session?.user.id);
    const calender = await calenderFactory().index(user.id);
    return {
      props: {
        user: user,
        session: session,
        calender: calender,
      },
    };
  }
  return {
    notFound: true,
  };
};
