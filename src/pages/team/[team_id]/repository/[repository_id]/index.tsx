import { Loading } from "@/components/Loading";
import {
  RepositoryDetail,
  RepositoryDetailProps,
} from "@/components/pages/RepositoryDetail";
import { itemType } from "@/components/pages/UserProfile";
import { repositoryFactory } from "@/models/Repository";
import { teamFactory } from "@/models/Team";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

type PathParams = {
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
  const { data: session } = useSession();
  const isTeamMember = owner.team_members?.find(
    ({ user }) => user.id === session?.user.id
  );
  let items: itemType[];
  if (isTeamMember) {
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

  if (router.isFallback) {
    return <Loading />;
  }

  return (
    <RepositoryDetail
      repository={repository}
      folders={folders}
      files={files}
      owner={owner}
      issues={issues}
      type={"team"}
      sessionUserId={session?.user.id}
      router={router}
      items={items}
    />
  );
};

export default RepositoryDetailPage;
RepositoryDetailPage.requireAuth = true;

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
    const folders =
      repository.folders &&
      repository.folders.filter(({ parent_id }) => parent_id === "");
    const files =
      repository.files &&
      repository.files.filter(({ parent_id }) => parent_id === "");
    const team = repository.team && repository.team;
    const issues = repository.issues && repository.issues;
    return {
      props: {
        repository: repository,
        folders: folders,
        files: files,
        owner: team,
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
