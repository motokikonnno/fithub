import { Loading } from "@/components/Loading";
import { UserProfile, UserProfileProps } from "@/components/pages/UserProfile";
import { userFactory } from "@/models/User";
import { AuthNextPage } from "@/types/auth-next-page";
import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

type PathParams = {
  user_id: string;
};

const UserProfilePage: AuthNextPage<UserProfileProps> = ({ userData }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const isSessionUser = session?.user.id === userData.id;

  if (router.isFallback) {
    return <Loading />;
  }
  return (
    <UserProfile
      userData={userData}
      router={router}
      isSessionUser={isSessionUser}
    />
  );
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
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { user_id } = context.params as PathParams;
  try {
    const user = await userFactory().show(user_id);

    return {
      props: { userData: user },
      revalidate: 60,
    };
  } catch {
    return {
      notFound: true,
      revalidate: 60,
    };
  }
};
