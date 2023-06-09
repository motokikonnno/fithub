import { CreateRepository } from "@/components/pages/CreateRepository";
import useFetchTeam from "@/hooks/useFetchTeam";
import useFetchUser from "@/hooks/useFetchUser";
import { shapeOwnerDataList } from "@/services/ownerList";
import { AuthNextPage } from "@/types/auth-next-page";
import { Owner } from "@/types/owner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ErrorPage from "../404";

const CreateRepositoryPage: AuthNextPage = () => {
  const router = useRouter();
  const { type, team_id } = router.query;
  const teamId = Array.isArray(team_id) ? team_id[0] : team_id;
  const { data: session } = useSession();
  const { user } = useFetchUser(session?.user ? session.user.id : null);
  const teamList = (user && shapeOwnerDataList(user).teamData) || [];
  const ownerList: Owner[] = [
    { id: user?.id ?? "", name: user?.name, image: user?.image, type: "user" },
    ...teamList,
  ];
  const { team } = useFetchTeam(teamId ? teamId : null);
  let currentOwner: Owner;
  if (type === "user" && user?.name && user.image) {
    currentOwner = {
      id: user.id,
      name: user.name,
      image: user.image,
      type: type,
    };
    return (
      <CreateRepository
        currentOwner={currentOwner}
        ownerList={ownerList}
        type={type}
        router={router}
      />
    );
  } else if (type === "team" && team?.name && team.image) {
    currentOwner = {
      id: team.id,
      name: team.name,
      image: team.image,
      type: "team",
    };
    return (
      <CreateRepository
        currentOwner={currentOwner}
        ownerList={ownerList}
        type={type}
        router={router}
      />
    );
  } else {
    return <ErrorPage />;
  }
};

export default CreateRepositoryPage;
CreateRepositoryPage.requireAuth = true;
