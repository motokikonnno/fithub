import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { NextComponentType } from "next";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AuthGuard } from "@/components/layouts/AuthGuard";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Loading } from "@/components/Loading";

export type AuthAppProps = AppProps<{ session: Session }> & {
  Component: NextComponentType & { requireAuth?: boolean };
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AuthAppProps) {
  // const router = useRouter();
  // const [pageLoading, setPageLoading] = useState(false);

  // useEffect(() => {
  //   const handleStart = (url: string) =>
  //     url !== router.asPath && setPageLoading(true);
  //   const handleComplete = () => setPageLoading(false);

  //   router.events.on("routeChangeStart", handleStart);
  //   router.events.on("routeChangeComplete", handleComplete);
  //   router.events.on("routeChangeError", handleComplete);

  //   return () => {
  //     router.events.off("routeChangeStart", handleStart);
  //     router.events.off("routeChangeComplete", handleComplete);
  //     router.events.off("routeChangeError", handleComplete);
  //   };
  // });

  return (
    <SessionProvider session={session}>
      {Component.requireAuth ? (
        <AuthGuard>
          <Component {...pageProps} />
          {/* {pageLoading ? <Loading /> : <Component {...pageProps} />} */}
        </AuthGuard>
      ) : (
        <Component {...pageProps} />
        // <>{pageLoading ? <Loading /> : <Component {...pageProps} />}</>
      )}
    </SessionProvider>
  );
}
