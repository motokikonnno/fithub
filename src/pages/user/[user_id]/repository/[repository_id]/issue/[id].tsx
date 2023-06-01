import { IssueDetail } from "@/components/pages/IssueDetail";
import { AuthNextPage } from "@/types/auth-next-page";

const IssueDetailPage: AuthNextPage = () => {
  return <IssueDetail />;
};

export default IssueDetailPage;
IssueDetailPage.requireAuth = true;
