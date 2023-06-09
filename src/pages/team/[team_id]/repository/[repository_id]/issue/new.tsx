import { CreateIssue, CreateIssueProps } from "@/components/pages/CreateIssue";
import { repositoryFactory } from "@/models/Repository";
import { teamFactory } from "@/models/Team";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

type PathParams = {
  repository_id: string;
};

const CreateIssuePage: AuthNextPage<CreateIssueProps> = ({
  repository,
  owner,
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const isTeamMember =
    owner &&
    owner.team_members?.find(({ user }) => user.id === session?.user.id);

  if (!isTeamMember) {
    return <div>404</div>;
  }
  return (
    <CreateIssue
      repository={repository}
      owner={owner}
      type={"team"}
      router={router}
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
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { repository_id } = context.params as PathParams;
  try {
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
  } catch {
    return {
      notFound: true,
      revalidate: 60,
    };
  }
};
