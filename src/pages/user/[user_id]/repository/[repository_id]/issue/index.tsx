import { AuthNextPage } from "@/types/auth-next-page";
import { IssueList, IssuePropsType } from "@/components/pages/IssueList";
import { GetServerSideProps } from "next";
import { userFactory } from "@/models/User";
import { repositoryFactory } from "@/models/Repository";
import { itemType } from "@/components/pages/UserProfile";
import { useSession } from "next-auth/react";
import ErrorPage from "@/pages/404";

type QueryParams = {
  repository_id: string;
  user_id: string;
};

const UserIssueListPage: AuthNextPage<IssuePropsType> = ({
  owner,
  ownerType,
  issues,
  repository,
}) => {
  const { data: session } = useSession();
  const items: itemType[] = [
    {
      id: "1",
      name: "Log",
      link: `/user/${owner.id}/repository/${repository.id}`,
    },
    {
      id: "2",
      name: "Issue",
    },
  ];

  if (owner.id !== session?.user.id) {
    return <ErrorPage isSession={true} />;
  }

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

export default UserIssueListPage;
UserIssueListPage.requireAuth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { user_id, repository_id } = context.query as QueryParams;
    const user = await userFactory().show(user_id);
    const repository = await repositoryFactory().show(repository_id);
    const issues = repository.issues;
    return {
      props: {
        owner: user,
        repository: repository,
        issues: issues,
        ownerType: "user",
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
