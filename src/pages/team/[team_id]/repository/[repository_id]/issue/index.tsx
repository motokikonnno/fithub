import { AuthNextPage } from "@/types/auth-next-page";
import { IssueList, IssuePropsType } from "@/components/pages/IssueList";
import { GetServerSideProps } from "next";
import { repositoryFactory } from "@/models/Repository";
import { Team, teamFactory } from "@/models/Team";
import { useSession } from "next-auth/react";
import { itemType } from "@/components/pages/UserProfile";
import ErrorPage from "@/pages/404";

type QueryParams = {
  repository_id: string;
  team_id: string;
};

const TeamIssueListPage: AuthNextPage<IssuePropsType> = ({
  owner,
  ownerType,
  issues,
  repository,
}) => {
  const { data: session } = useSession();
  const team = owner as Team;
  const isTeamMember =
    team && team.team_members?.find(({ user }) => user.id === session?.user.id);
  if (!isTeamMember) {
    return <ErrorPage isSession={true} />;
  }
  const items: itemType[] = [
    {
      id: "1",
      name: "Log",
      link: `/team/${owner.id}/repository/${repository.id}`,
    },
    {
      id: "2",
      name: "Issue",
    },
  ];

  return (
    <IssueList
      owner={owner}
      ownerType={ownerType}
      issues={issues}
      repository={repository}
      items={items}
    />
  );
};

export default TeamIssueListPage;
TeamIssueListPage.requireAuth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { team_id, repository_id } = context.query as QueryParams;
    const team = await teamFactory().show(team_id);
    const repository = await repositoryFactory().show(repository_id);
    const issues = repository.issues;
    return {
      props: {
        owner: team,
        repository: repository,
        issues: issues,
        ownerType: "team",
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
