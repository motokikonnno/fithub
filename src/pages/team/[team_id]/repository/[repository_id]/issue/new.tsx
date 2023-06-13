import { CreateIssue, CreateIssueProps } from "@/components/pages/CreateIssue";
import { itemType } from "@/components/pages/UserProfile";
import { repositoryFactory } from "@/models/Repository";
import { teamFactory } from "@/models/Team";
import ErrorPage from "@/pages/404";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/react";

// TODO: assignUserの挙動がおかしいので修正する

type PathParams = {
  repository_id: string;
};

const CreateIssuePage: AuthNextPage<CreateIssueProps> = ({
  repository,
  owner,
}) => {
  const { data: session } = useSession();
  const isTeamMember =
    owner &&
    owner.team_members?.find(({ user }) => user.id === session?.user.id);

  if (!isTeamMember) {
    return <ErrorPage />;
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
    <CreateIssue
      repository={repository}
      owner={owner}
      type={"team"}
      items={items}
    />
  );
};

export default CreateIssuePage;
CreateIssuePage.requireAuth = true;

export const getStaticPaths: GetStaticPaths = async () => {
  const teams = await teamFactory().index();
  const repositories = await repositoryFactory().index();
  const paths = teams.flatMap((team) =>
    repositories.map((repository) => ({
      params: {
        team_id: team.id.toString(),
        repository_id: repository.id.toString(),
      },
    }))
  );
  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { repository_id } = context.params as PathParams;

  const repository = await repositoryFactory().show(repository_id);
  if (repository.team_id) {
    const owner = await teamFactory().show(repository.team_id);
    return {
      props: {
        repository: repository,
        owner: owner,
      },
    };
  } else {
    return { props: {} };
  }
};
