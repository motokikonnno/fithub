import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { NextComponentType } from "next";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AuthGuard } from "@/components/layouts/AuthGuard";
import { usePageView } from "@/hooks/usePageView";
import { Progressbar } from "@/components/Progressbar";

export type AuthAppProps = AppProps<{ session: Session }> & {
  Component: NextComponentType & { requireAuth?: boolean };
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AuthAppProps) {
  usePageView();
  return (
    <SessionProvider session={session}>
      <Progressbar />
      {Component.requireAuth ? (
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
}
