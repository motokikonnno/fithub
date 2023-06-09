import { Loading } from "@/components/Loading";
import { IssueDetail, IssueDetailProps } from "@/components/pages/IssueDetail";
import { issueFactory } from "@/models/Issue";
import { repositoryFactory } from "@/models/Repository";
import { teamFactory } from "@/models/Team";
import ErrorPage from "@/pages/404";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

type PathParams = {
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
  const router = useRouter();
  const isTeamMember =
    team && team.team_members?.find(({ user }) => user.id === session?.user.id);

  if (!isTeamMember) {
    return <ErrorPage />;
  }

  if (router.isFallback) {
    return <Loading />;
  }
  return (
    <IssueDetail
      repository={repository}
      issue={issue}
      team={team}
      sessionUserId={session?.user.id}
      router={router}
    />
  );
};

export default IssueDetailPage;
IssueDetailPage.requireAuth = true;

export const getStaticPaths: GetStaticPaths = async () => {
  const issues = await issueFactory().index();
  const teams = await teamFactory().index();
  const repositories = await repositoryFactory().index();
  const paths = teams.flatMap((team) =>
    repositories.flatMap((repository) =>
      issues.map((issue) => ({
        params: {
          team_id: team.id.toString(),
          repository_id: repository.id.toString(),
          id: issue.id.toString(),
        },
      }))
    )
  );
  return {
    paths: paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { repository_id, id, team_id } = context.params as PathParams;
  try {
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
      revalidate: 60,
    };
  }
};
