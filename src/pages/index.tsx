import { Dashboard } from "@/components/pages/Dashboard";
import { AuthNextPage } from "@/types/auth-next-page";

const DashboardPage: AuthNextPage = () => {
  return <Dashboard />;
};

export default DashboardPage;
DashboardPage.requireAuth = true;
