import { UserProfile, UserProfileProps } from "@/components/pages/UserProfile";
import { calenderFactory } from "@/models/Calender";
import { countFactory } from "@/models/Count";
import { repositoryFactory } from "@/models/Repository";
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
  repositories,
  calender,
}) => {
  return (
    <UserProfile
      userData={userData}
      isSessionUser={isSessionUser}
      count={count}
      repositories={repositories}
      calender={calender}
    />
  );
};

export default UserProfilePage;
UserProfilePage.requireAuth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { user_id } = context.query as QueryParams;
    const user = await userFactory().show(user_id);
    const session = await getSession(context);
    const isSessionUser = session?.user.id === user.id;
    const count = await countFactory().get(`${user_id}_user`);
    const calender = await calenderFactory().index(user_id);
    const repositories = await repositoryFactory().index({
      queries: {
        owner_id: user_id,
        isPrivate: isSessionUser,
        type: "user",
        page: 1,
      },
    });

    return {
      props: {
        userData: user,
        isSessionUser: isSessionUser,
        count: count,
        repositories: repositories,
        calender: calender,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
