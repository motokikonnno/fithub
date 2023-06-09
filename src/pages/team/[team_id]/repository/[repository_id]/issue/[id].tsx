import { IssueDetail, IssueDetailProps } from "@/components/pages/IssueDetail";
import { itemType } from "@/components/pages/UserProfile";
import { issueFactory } from "@/models/Issue";
import { repositoryFactory } from "@/models/Repository";
import { teamFactory } from "@/models/Team";
import ErrorPage from "@/pages/404";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";

type QueryParams = {
  repository_id: string;
  id: string;
  team_id: string;
};

const IssueDetailPage: AuthNextPage<IssueDetailProps> = ({
  repository,
  issue,
  team,
}) => {
  const { data: session } = useSession();
  const isSessionUser = team?.team_members
    ? team.team_members.some(({ user }) => user.id === session?.user.id)
    : false;

  if (!isSessionUser) {
    return <ErrorPage isSession={true} />;
  }

  const items: itemType[] = [
    {
      id: "1",
      name: "Log",
      link: `/team/${team && team.id}/repository/${repository.id}`,
    },
    {
      id: "2",
      name: "Issue",
    },
  ];

  return (
    <IssueDetail
      repository={repository}
      issue={issue}
      team={team}
      sessionUserId={session?.user.id}
      items={items}
    />
  );
};

export default IssueDetailPage;
IssueDetailPage.requireAuth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { repository_id, id, team_id } = context.query as QueryParams;
    const repository = await repositoryFactory().show(repository_id);
    const team = await teamFactory().show(team_id);
    const issue = await issueFactory().show(id);
    return {
      props: {
        repository: repository,
        team: team,
        issue: issue,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
