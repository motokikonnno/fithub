import { CreateRepository } from "@/components/pages/CreateRepository";
import { Team, teamFactory } from "@/models/Team";
import { userFactory, UserBelongsToTeam } from "@/models/User";
import { shapeOwnerDataList } from "@/services/ownerList";
import { AuthNextPage } from "@/types/auth-next-page";
import { Owner } from "@/types/owner";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import ErrorPage from "../404";

type CreateRepositoryPageProps = {
  user: UserBelongsToTeam;
  team: Team;
  ownerList: Owner[];
  type: string;
};

const CreateRepositoryPage: AuthNextPage<CreateRepositoryPageProps> = ({
  user,
  team,
  ownerList,
  type,
}) => {
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
      />
    );
  } else {
    return <ErrorPage />;
  }
};

export default CreateRepositoryPage;
CreateRepositoryPage.requireAuth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getSession(context);
    if (session) {
      const { type, team_id } = context.query;
      const teamId = Array.isArray(team_id) ? team_id[0] : team_id;
      const user = await userFactory().show(session?.user.id);
      const teamList = (user && shapeOwnerDataList(user).teamData) || [];
      const ownerList: Owner[] = [
        {
          id: user?.id ?? "",
          name: user?.name,
          image: user?.image,
          type: "user",
        },
        ...teamList,
      ];
      const team = await teamFactory().show(teamId ? teamId : "");
      return {
        props: {
          type: type,
          ownerList: ownerList,
          team: team || null,
          user: user,
        },
      };
    } else {
      return {
        props: {},
      };
    }
  } catch {
    return {
      notFound: true,
    };
  }
};
