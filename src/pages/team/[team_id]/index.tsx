import { TeamProfile, TeamProfileProps } from "@/components/pages/TeamProfile";
import { countFactory } from "@/models/Count";
import { repositoryFactory } from "@/models/Repository";
import { teamFactory } from "@/models/Team";
import { teamMemberFactory } from "@/models/TeamMember";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

type QueryParams = {
  team_id: string;
};

const TeamProfilePage: AuthNextPage<
  TeamProfileProps & { session: Session }
> = ({ teamData, count, repositories, isSessionUser, session, members }) => {
  const items = isSessionUser
    ? [
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
      ]
    : [
        {
          id: "1",
          name: "Overview",
        },
        {
          id: "3",
          name: "People",
        },
      ];

  return (
    <TeamProfile
      teamData={teamData}
      isSessionUser={isSessionUser}
      items={items}
      sessionUserName={session?.user.name}
      count={count}
      repositories={repositories}
      members={members}
    />
  );
};

export default TeamProfilePage;
TeamProfilePage.requireAuth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { team_id } = context.query as QueryParams;
  const session = await getSession(context);
  const teamData = await teamFactory().show(team_id);
  const isSessionUser = teamData.team_members
    ? teamData.team_members.some(({ user }) => user.id === session?.user.id)
    : false;
  const count = await countFactory().get(`${teamData.id}_team`);
  const repositories = await repositoryFactory().index({
    queries: {
      owner_id: team_id,
      isPrivate: isSessionUser,
      type: "team",
      page: 1,
    },
  });
  const members = await teamMemberFactory().index({
    queries: { team_id: team_id },
  });

  return {
    props: {
      teamData: teamData,
      count: count,
      repositories: repositories,
      isSessionUser: isSessionUser,
      session: session,
      members: members,
    },
  };
};
