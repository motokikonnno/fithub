import { Loading } from "@/components/Loading";
import { TeamList, TeamListProps } from "@/components/pages/TeamList";
import useFetchUser from "@/hooks/useFetchUser";
import { AuthNextPage } from "@/types/auth-next-page";
import { useSession } from "next-auth/react";

const TeamListPage: AuthNextPage<TeamListProps> = () => {
  const { data: session } = useSession();
  const { user } = useFetchUser(session?.user ? session.user.id : null);
  // TODO: if文の条件をSWRのisLoadingに変える
  if (user) {
    return <TeamList user={user} />;
  } else {
    return <Loading />;
  }
};

export default TeamListPage;
TeamListPage.requireAuth = true;
