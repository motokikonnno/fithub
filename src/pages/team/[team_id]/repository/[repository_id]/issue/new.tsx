import { CreateIssue } from "@/components/pages/CreateIssue";
import { AuthNextPage } from "@/types/auth-next-page";

const CreateIssuePage: AuthNextPage = () => {
  return <CreateIssue />;
};

export default CreateIssuePage;
CreateIssuePage.requireAuth = true;
