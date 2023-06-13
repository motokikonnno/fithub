import { UserProfile, UserProfileProps } from "@/components/pages/UserProfile";
import { countFactory } from "@/models/Count";
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
  count,
}) => {
  return (
    <UserProfile
      userData={userData}
      isSessionUser={isSessionUser}
      count={count}
    />
  );
};

export default UserProfilePage;
UserProfilePage.requireAuth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user_id } = context.query as QueryParams;
  try {
    const user = await userFactory().show(user_id);
    const session = await getSession(context);
    const isSessionUser = session?.user.id === user.id;
    const count = await countFactory().get(`${user_id}_user`);

    return {
      props: { userData: user, isSessionUser: isSessionUser, count: count },
    };
  } catch {
    return {
      props: {},
    };
  }
};
