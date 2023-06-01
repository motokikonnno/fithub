import { RepositoryDetail } from "@/components/pages/RepositoryDetail";
import { repositoryFactory } from "@/models/Repository";
import { userFactory } from "@/models/User";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetStaticPaths, GetStaticProps } from "next";

type PathParams = {
  user_id: string;
  repository_id: string;
};

const RepositoryDetailPage: AuthNextPage = () => {
  return <RepositoryDetail />;
};

export default RepositoryDetailPage;
RepositoryDetailPage.requireAuth = true;

export const getStaticPaths: GetStaticPaths = async () => {
  const users = await userFactory().index();
  // const usersPath = users.map(({ id }) => ({
  //   params: { user_id: id.toString() },
  // }));
  const repositories = await repositoryFactory().getAll();
  // const repositoriesPath = repositories.map(({ id }) => ({
  //   params: { repository_id: id.toString() },
  // }));
  const paths = users.flatMap((user) =>
    repositories.map((repository) => ({
      params: {
        user_id: user.id.toString(),
        repository_id: repository.id.toString(),
      },
    }))
  );
  return {
    // paths: [...usersPath, ...repositoriesPath],
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { user_id, repository_id } = context.params as PathParams;
  const repository = await repositoryFactory().show(user_id, repository_id);
  return {
    props: { repository: repository },
  };
};
