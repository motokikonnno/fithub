import { Dashboard } from "@/components/pages/Dashboard";
import useFetchUser from "@/hooks/useFetchUser";
import { AuthNextPage } from "@/types/auth-next-page";
import { useSession } from "next-auth/react";
import ErrorPage from "./404";

const DashboardPage: AuthNextPage = () => {
  const { data: session } = useSession();
  const { user } = useFetchUser(session?.user ? session.user.id : null);
  if (user) {
    return <Dashboard user={user} />;
  } else {
    return <ErrorPage />;
  }
};

export default DashboardPage;
DashboardPage.requireAuth = true;
