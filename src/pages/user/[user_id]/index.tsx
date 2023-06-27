import { UserProfile, UserProfileProps } from "@/components/pages/UserProfile";
import { userFactory } from "@/models/User";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetServerSideProps } from "next";

type QueryParams = {
  user_id: string;
};

const UserProfilePage: AuthNextPage<UserProfileProps> = ({ userData }) => {
  return <UserProfile userData={userData} />;
};

export default UserProfilePage;
UserProfilePage.requireAuth = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { user_id } = context.query as QueryParams;
    const user = await userFactory().show(user_id);

    return {
      props: {
        userData: user,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
