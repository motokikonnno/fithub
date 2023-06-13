import { Loading } from "@/components/Loading";
import {
  RepositoryDetail,
  RepositoryDetailProps,
} from "@/components/pages/RepositoryDetail";
import { itemType } from "@/components/pages/UserProfile";
import { fileFactory } from "@/models/File";
import { folderFactory } from "@/models/Folder";
import { repositoryFactory } from "@/models/Repository";
import { userFactory } from "@/models/User";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

type QueryParams = {
  repository_id: string;
};

const RepositoryDetailPage: AuthNextPage<RepositoryDetailProps> = ({
  repository,
  folders,
  files,
  owner,
  issues,
}) => {
  const router = useRouter();
  const { repository_id } = router.query as QueryParams;
  const { data: session } = useSession();
  const isSessionUser = session?.user.id === owner.id;
  let items: itemType[];
  if (owner.id === session?.user.id) {
    items = [
      {
        id: "1",
        name: "Log",
      },
      {
        id: "2",
        name: "Issue",
      },
    ];
  } else {
    items = [
      {
        id: "1",
        name: "Log",
      },
    ];
  }

  return (
    <RepositoryDetail
      repository={repository}
      folders={folders}
      files={files}
      owner={owner}
      issues={issues}
      type={"user"}
      router={router}
      sessionUserId={session?.user.id}
      items={items}
      isSessionUser={isSessionUser}
    />
  );
};

export default RepositoryDetailPage;
RepositoryDetailPage.requireAuth = true;

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { repository_id } = context.query as QueryParams;
//   const repository = await repositoryFactory().show(repository_id);
//   const folders = await folderFactory().index(repository_id, "");
//   const files = await fileFactory().index(repository_id, "");
//   const user = repository.user && repository.user;
//   const issues = repository.issues && repository.issues;

//   return {
//     props: {
//       repository: repository,
//       folders: folders,
//       files: files,
//       owner: user,
//       issues: issues,
//     },
//   };
// };

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
  const { repository_id } = context.params as QueryParams;
  try {
    const repository = await repositoryFactory().show(repository_id);
    const folders =
      repository.folders &&
      repository.folders.filter(({ parent_id }) => parent_id === "");
    const files =
      repository.files &&
      repository.files.filter(({ parent_id }) => parent_id === "");
    const user = repository.user && repository.user;
    const issues = repository.issues && repository.issues;
    return {
      props: {
        repository: repository,
        folders: folders,
        files: files,
        owner: user,
        issues: issues,
      },
    };
  } catch {
    return {
      notFound: true,
      revalidate: 60,
    };
  }
};
