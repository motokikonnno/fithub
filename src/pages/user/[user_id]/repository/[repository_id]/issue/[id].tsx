import { IssueDetail } from "@/components/pages/IssueDetail";
import { itemType } from "@/components/pages/UserProfile";
import { Issue, issueFactory } from "@/models/Issue";
import { Repository, repositoryFactory } from "@/models/Repository";
import ErrorPage from "@/pages/404";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";

type QueryParams = {
  repository_id: string;
  id: string;
  user_id: string;
};

type IssueDetailPageProps = {
  issue: Issue;
  repository: Repository;
  user_id: string;
};

const IssueDetailPage: AuthNextPage<IssueDetailPageProps> = ({
  issue,
  repository,
  user_id,
}) => {
  const { data: session } = useSession();

  if (user_id !== session?.user.id) {
    return <ErrorPage isSession={true} />;
  }

  const items: itemType[] = [
    {
      id: "1",
      name: "Log",
      link: `/user/${user_id}/repository/${repository.id}`,
    },
    {
      id: "2",
      name: "Issue",
    },
  ];

  return <IssueDetail repository={repository} issue={issue} items={items} />;
};

export default IssueDetailPage;
IssueDetailPage.requireAuth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { repository_id, id, user_id } = context.query as QueryParams;
    const repository = await repositoryFactory().show(repository_id);
    const issue = await issueFactory().show(id);
    return {
      props: {
        repository: repository,
        issue: issue,
        user_id: user_id,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
