import {
  RepositoryDetail,
  RepositoryDetailProps,
} from "@/components/pages/RepositoryDetail";
import { repositoryFactory } from "@/models/Repository";
import { userFactory } from "@/models/User";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetStaticPaths, GetStaticProps } from "next";

type PathParams = {
  repository_id: string;
};

const RepositoryDetailPage: AuthNextPage<RepositoryDetailProps> = ({
  repository,
}) => {
  return <RepositoryDetail repository={repository} />;
};

export default RepositoryDetailPage;
RepositoryDetailPage.requireAuth = true;

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
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { repository_id } = context.params as PathParams;
  const repository = await repositoryFactory().show(
    "clibs60je0001dms0x1fqz9ie"
  );
  return {
    props: { repository: repository },
  };
};
