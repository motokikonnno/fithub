import { Loading } from "@/components/Loading";
import { IssueDetail, IssueDetailProps } from "@/components/pages/IssueDetail";
import { issueFactory } from "@/models/Issue";
import { repositoryFactory } from "@/models/Repository";
import { userFactory } from "@/models/User";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

type PathParams = {
  repository_id: string;
  id: string;
  user_id: string;
};

const IssueDetailPage: AuthNextPage<IssueDetailProps> = ({
  issue,
  user,
  repository,
}) => {
  const router = useRouter();
  if (router.isFallback) {
    return <Loading />;
  }
  return <IssueDetail user={user} repository={repository} issue={issue} />;
};

export default IssueDetailPage;
IssueDetailPage.requireAuth = true;

export const getStaticPaths: GetStaticPaths = async () => {
  const issues = await issueFactory().index();
  const users = await userFactory().index();
  const repositories = await repositoryFactory().index();
  const paths = users.flatMap((user) =>
    repositories.flatMap((repository) =>
      issues.map((issue) => ({
        params: {
          user_id: user.id.toString(),
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
  const { repository_id, id, user_id } = context.params as PathParams;
  try {
    const repository = await repositoryFactory().show(repository_id);
    const user = await userFactory().show(user_id);
    const issue = await issueFactory().show(id);
    return {
      props: {
        repository: repository,
        user: user,
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
