import { SignIn } from "@/components/pages/SignIn";
import { signOut, useSession } from "next-auth/react";
import { GetStaticProps, NextPage } from "next";

const SignInPage: NextPage = () => {
  const { status } = useSession();
  if (status === "authenticated") signOut();
  return <SignIn />;
};

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {},
  };
};

export default SignInPage;
