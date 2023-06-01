import { Dashboard, DashboardProps } from "@/components/pages/Dashboard";
import { repositoryFactory } from "@/models/Repository";
import { userFactory } from "@/models/User";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

const DashboardPage: AuthNextPage<DashboardProps> = ({ user }) => {
  return <Dashboard user={user} />;
};

export default DashboardPage;
DashboardPage.requireAuth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const user = session?.user;

  return {
    props: { user },
  };
};
