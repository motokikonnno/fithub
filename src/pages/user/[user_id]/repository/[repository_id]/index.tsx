import { Loading } from "@/components/Loading";
import {
  RepositoryDetail,
  RepositoryDetailProps,
} from "@/components/pages/RepositoryDetail";
import { repositoryFactory } from "@/models/Repository";
import { userFactory } from "@/models/User";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

type PathParams = {
  repository_id: string;
};

const RepositoryDetailPage: AuthNextPage<RepositoryDetailProps> = ({
  repository,
  folders,
  files,
  user,
}) => {
  const router = useRouter();

  if (router.isFallback) {
    return <Loading />;
  }

  return (
    <RepositoryDetail
      repository={repository}
      folders={folders}
      files={files}
      user={user}
    />
  );
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
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { repository_id } = context.params as PathParams;
  try {
    const repository = await repositoryFactory().show(repository_id);
    const folders =
      repository.folders &&
      repository.folders.filter(({ parent_id }) => parent_id === "");
    const files =
      repository.files &&
      repository.files.filter(({ parent_id }) => parent_id === "");
    const user = repository.user && repository.user;
    return {
      props: {
        repository: repository,
        folders: folders,
        files: files,
        user: user,
      },
    };
  } catch {
    return {
      notFound: true,
      revalidate: 60,
    };
  }
};
