import { CreateIssue, CreateIssueProps } from "@/components/pages/CreateIssue";
import { itemType } from "@/components/pages/UserProfile";
import { repositoryFactory } from "@/models/Repository";
import { teamFactory } from "@/models/Team";
import ErrorPage from "@/pages/404";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";

type QueryParams = {
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { repository_id } = context.query as QueryParams;
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
      return { notFound: true };
    }
  } catch {
    return {
      notFound: true,
    };
  }
};
