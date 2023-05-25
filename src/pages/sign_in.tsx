import { SignIn, SignInProps } from "@/components/pages/SignIn";
import { getProviders, signOut, useSession } from "next-auth/react";
import { InferGetServerSidePropsType, NextPage } from "next";

const SignInPage: NextPage<SignInProps> = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { status } = useSession();
  if (status === "authenticated") signOut();
  return <SignIn providers={providers} />;
};

export const getServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

export default SignInPage;
