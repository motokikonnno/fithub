import { UserProfile, UserProfileProps } from "@/components/pages/UserProfile";
import { userFactory } from "@/models/User";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

type QueryParams = {
  user_id: string;
};

const UserProfilePage: AuthNextPage<UserProfileProps> = ({
  userData,
  isSessionUser,
}) => {
  return <UserProfile userData={userData} isSessionUser={isSessionUser} />;
};

export default UserProfilePage;
UserProfilePage.requireAuth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user_id } = context.query as QueryParams;
  try {
    const user = await userFactory().show(user_id);
    const session = await getSession();
    const isSessionUser = session?.user.id === user.id;

    return {
      props: { userData: user, isSessionUser: isSessionUser },
    };
  } catch {
    return {
      props: {},
    };
  }
};
