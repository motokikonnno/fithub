import { Loading } from "@/components/Loading";
import { TeamProfile, TeamProfileProps } from "@/components/pages/TeamProfile";
import { itemType } from "@/components/pages/UserProfile";
import { teamFactory } from "@/models/Team";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

type PathParams = {
  team_id: string;
};

const TeamProfilePage: AuthNextPage<TeamProfileProps> = ({ teamData }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const isSessionUser = teamData.team_members
    ? teamData.team_members.some(({ user }) => user.id === session?.user.id)
    : false;
  let items: itemType[];
  if (isSessionUser) {
    items = [
      {
        id: "1",
        name: "Overview",
      },
      {
        id: "2",
        name: "Repositories",
      },
      {
        id: "3",
        name: "People",
      },
      {
        id: "4",
        name: "Invite",
      },
    ];
  } else {
    items = [
      {
        id: "1",
        name: "Overview",
      },
      {
        id: "3",
        name: "People",
      },
    ];
  }

  if (router.isFallback) {
    return <Loading />;
  }
  return (
    <TeamProfile
      teamData={teamData}
      router={router}
      isSessionUser={isSessionUser}
      items={items}
      sessionUserName={session?.user.name}
    />
  );
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
    const teamData = await teamFactory().show(team_id);
    return {
      props: { teamData: teamData },
      revalidate: 60,
    };
  } catch {
    return {
      notFound: true,
      revalidate: 60,
    };
  }
};
