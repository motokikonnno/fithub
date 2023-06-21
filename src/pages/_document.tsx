import { Html, Head, Main, NextScript } from "next/document";
import { GA_ID } from "@/lib/gtag";

export default function Document() {
  const url = process.env.NEXTAUTH_URL;
  return (
    <Html lang="ja">
      <Head>
        <link rel="icon" href="/logo.png" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={"FitHub"} />
        <meta
          name="twitter:description"
          content={
            "It's a strength training tracking app designed for engineers."
          }
        />
        <meta name="twitter:image" content={`${url}/logo.png`} />
        {GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                   window.dataLayer = window.dataLayer || [];
                   function gtag(){dataLayer.push(arguments);}
                   gtag('js', new Date());
                   gtag('config', '${GA_ID}', {
                     page_path: window.location.pathname,
                   });`,
              }}
            />
          </>
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
