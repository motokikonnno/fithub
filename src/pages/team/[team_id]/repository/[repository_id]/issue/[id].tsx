import { IssueDetail, IssueDetailProps } from "@/components/pages/IssueDetail";
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
    return <ErrorPage />;
  }

  return (
    <IssueDetail
      repository={repository}
      issue={issue}
      team={team}
      sessionUserId={session?.user.id}
    />
  );
};

export default IssueDetailPage;
IssueDetailPage.requireAuth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
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
};
