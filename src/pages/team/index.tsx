import { TeamList } from "@/components/pages/TeamList";
import { AuthNextPage } from "@/types/auth-next-page";

const TeamListPage: AuthNextPage = () => {
  return <TeamList />;
};

export default TeamListPage;
TeamListPage.requireAuth = true;
