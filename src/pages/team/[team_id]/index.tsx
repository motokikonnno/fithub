import { TeamProfile } from "@/components/pages/TeamProfile";
import { AuthNextPage } from "@/types/auth-next-page";

const TeamProfilePage: AuthNextPage = () => {
  return <TeamProfile />;
};

export default TeamProfilePage;
TeamProfilePage.requireAuth = true;
