import { UserProfile, UserProfileProps } from "@/components/pages/UserProfile";
import { userFactory } from "@/models/User";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetStaticPaths, GetStaticProps } from "next";

type PathParams = {
  user_id: string;
};

const UserProfilePage: AuthNextPage<UserProfileProps> = ({ userData }) => {
  return <UserProfile userData={userData} />;
};

export default UserProfilePage;
UserProfilePage.requireAuth = true;

export const getStaticPaths: GetStaticPaths = async () => {
  const users = await userFactory().index();
  const paths = users.map(({ id }) => ({
    params: { user_id: id },
  }));
  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { user_id } = context.params as PathParams;
  const user = await userFactory().show(user_id);
  return {
    props: { userData: user },
  };
};
