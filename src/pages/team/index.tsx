import { Loading } from "@/components/Loading";
import { TeamList, TeamListProps } from "@/components/pages/TeamList";
import useFetchUser from "@/hooks/useFetchUser";
import { AuthNextPage } from "@/types/auth-next-page";
import { useSession } from "next-auth/react";

const TeamListPage: AuthNextPage<TeamListProps> = () => {
  const { data: session } = useSession();
  const { user, isLoading } = useFetchUser(
    session?.user ? session.user.id : null
  );
  if (!isLoading && user) {
    return <TeamList user={user} />;
  } else {
    return <Loading />;
  }
};

export default TeamListPage;
TeamListPage.requireAuth = true;
