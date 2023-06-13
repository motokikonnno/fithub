import {
  RepositoryDetail,
  RepositoryDetailProps,
} from "@/components/pages/RepositoryDetail";
import { itemType } from "@/components/pages/UserProfile";
import { countFactory } from "@/models/Count";
import { fileFactory } from "@/models/File";
import { folderFactory } from "@/models/Folder";
import { repositoryFactory } from "@/models/Repository";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";

type QueryParams = {
  repository_id: string;
};

const RepositoryDetailPage: AuthNextPage<RepositoryDetailProps> = ({
  repository,
  folders,
  files,
  owner,
  issues,
  countData,
}) => {
  const { data: session } = useSession();
  const isSessionUser = owner.team_members
    ? owner.team_members.some(({ user }) => user.id === session?.user.id)
    : false;
  let items: itemType[];
  if (isSessionUser) {
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
      type={"team"}
      sessionUserId={session?.user.id}
      items={items}
      isSessionUser={isSessionUser}
      countData={countData}
    />
  );
};

export default RepositoryDetailPage;
RepositoryDetailPage.requireAuth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { repository_id } = context.query as QueryParams;

  const repository = await repositoryFactory().show(repository_id);
  const folders = await folderFactory().index(
    repository_id,
    `${repository_id}_`
  );
  const files = await fileFactory().index(repository_id, `${repository_id}_`);
  const countData = await countFactory().get(repository_id);
  const team = repository.team && repository.team;
  const issues = repository.issues && repository.issues;
  return {
    props: {
      repository: repository,
      folders: folders,
      files: files,
      owner: team,
      issues: issues,
      countData: countData,
    },
  };
};
