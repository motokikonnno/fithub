import { TeamProfile, TeamProfileProps } from "@/components/pages/TeamProfile";
import { itemType } from "@/components/pages/UserProfile";
import { countFactory } from "@/models/Count";
import { teamFactory } from "@/models/Team";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";

type QueryParams = {
  team_id: string;
};

const TeamProfilePage: AuthNextPage<TeamProfileProps> = ({
  teamData,
  count,
}) => {
  const { data: session } = useSession();
  const isSessionUser = teamData.team_members
    ? teamData.team_members.some(({ user }) => user.id === session?.user.id)
    : false;
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
    />
  );
};

export default TeamProfilePage;
TeamProfilePage.requireAuth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { team_id } = context.query as QueryParams;
  const teamData = await teamFactory().show(team_id);
  const count = await countFactory().get(`${teamData.id}_team`);
  return {
    props: { teamData: teamData, count: count },
  };
};
