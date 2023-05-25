import { CreateRepository } from "@/components/pages/CreateRepository";
import { AuthNextPage } from "@/types/auth-next-page";

const CreateRepositoryPage: AuthNextPage = () => <CreateRepository />;

export default CreateRepositoryPage;
CreateRepositoryPage.requireAuth = true;
