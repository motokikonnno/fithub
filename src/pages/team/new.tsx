import { CreateTeam } from "@/components/pages/CreateTeam";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetStaticProps } from "next";

const CreateTeamPage: AuthNextPage = () => <CreateTeam />;

export default CreateTeamPage;
CreateTeamPage.requireAuth = true;

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {},
  };
};
