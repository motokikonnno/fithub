import { Loading } from "@/components/Loading";
import { TeamProfile, TeamProfileProps } from "@/components/pages/TeamProfile";
import { teamFactory } from "@/models/Team";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

type PathParams = {
  team_id: string;
};

const TeamProfilePage: AuthNextPage<TeamProfileProps> = ({ team }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <Loading />;
  }
  return <TeamProfile team={team} />;
};

export default TeamProfilePage;
TeamProfilePage.requireAuth = true;

export const getStaticPaths: GetStaticPaths = async () => {
  const teams = await teamFactory().index();
  const paths = teams.map(({ id }) => ({
    params: { team_id: id },
  }));
  return {
    paths: paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { team_id } = context.params as PathParams;
  try {
    const team = await teamFactory().show(team_id);

    return {
      props: { team: team },
      revalidate: 60,
    };
  } catch {
    return {
      notFound: true,
      revalidate: 60,
    };
  }
};
