import { Loading } from "@/components/Loading";
import { CreateIssue, CreateIssueProps } from "@/components/pages/CreateIssue";
import { repositoryFactory } from "@/models/Repository";
import { userFactory } from "@/models/User";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

type PathParams = {
  repository_id: string;
};

const CreateIssuePage: AuthNextPage<CreateIssueProps> = ({
  repository,
  owner,
}) => {
  const router = useRouter();
  if (router.isFallback) {
    return <Loading />;
  }
  return <CreateIssue repository={repository} owner={owner} />;
};

export default CreateIssuePage;
CreateIssuePage.requireAuth = true;

export const getStaticPaths: GetStaticPaths = async () => {
  const users = await userFactory().index();
  const repositories = await repositoryFactory().index();
  const paths = users.flatMap((user) =>
    repositories.map((repository) => ({
      params: {
        user_id: user.id.toString(),
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
    const owner = await userFactory().show(repository.user_id);
    return {
      props: {
        repository: repository,
        owner: owner,
      },
    };
  } catch {
    return {
      notFound: true,
      revalidate: 60,
    };
  }
};
