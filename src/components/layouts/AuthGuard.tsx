import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";
import { Loading } from "../Loading";

type AuthGuardProps = {
  children: React.ReactNode;
};

export const AuthGuard: FC<AuthGuardProps> = ({ children }): any => {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "unauthenticated" && router.pathname !== "/sign_in")
      router.push("/sign_in");
  }, [router, status]);
  if (status === "loading") return <Loading />;
  if (status === "authenticated") return children;
};
