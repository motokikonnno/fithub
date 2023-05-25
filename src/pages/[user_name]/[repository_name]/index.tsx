import { RepositoryDetail } from "@/components/pages/RepositoryDetail";
import { AuthNextPage } from "@/types/auth-next-page";

const RepositoryDetailPage: AuthNextPage = () => {
  return <RepositoryDetail />;
};

export default RepositoryDetailPage;
RepositoryDetailPage.requireAuth = true;
