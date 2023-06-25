import { Loading } from "@/components/Loading";
import { Dashboard } from "@/components/pages/Dashboard";
import { userFactory } from "@/models/User";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import ErrorPage from "./404";

const DashboardPage: AuthNextPage = () => {
  // if (user?.id !== session?.user.id) {
  //   <ErrorPage isSession={true} />;
  // }

  // if (user) {
  return <Dashboard />;
  // } else {
  //   return <Loading />;
  // }
};

export default DashboardPage;
DashboardPage.requireAuth = true;

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const session = await getSession(context);
//   if (session) {
//     const user = await userFactory().show(session?.user.id);
//     // const activities = await activityFactory().index(user.id, 1);
//     // const calender = await calenderFactory().index(user.id);
//     return {
//       props: {
//         user: user,
//         // activities: activities,
//         session: session,
//         // calender: calender,
//       },
//     };
//   }
//   return {
//     notFound: true,
//   };
// };
