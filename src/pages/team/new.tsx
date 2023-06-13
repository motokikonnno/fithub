import { CreateTeam } from "@/components/pages/CreateTeam";
import { AuthNextPage } from "@/types/auth-next-page";

const CreateTeamPage: AuthNextPage = () => <CreateTeam />;

export default CreateTeamPage;
CreateTeamPage.requireAuth = true;

export async function getStaticProps() {
  return {
    props: {},
  };
}
