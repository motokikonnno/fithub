import { Html, Head, Main, NextScript } from "next/document";
import { GA_ID } from "@/lib/gtag";
import { randomBytes } from "crypto";

export default function Document() {
  const url = process.env.NEXTAUTH_URL;
  const nonce = randomBytes(128).toString("base64");
  const csp = `object-src 'none'; base-uri 'none'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https: http: 'nonce-${nonce}' 'strict-dynamic'`;

  return (
    <Html lang="ja">
      <Head nonce={nonce}>
        <meta httpEquiv="Content-Security-Policy" content={csp} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={"FitHub"} />
        <meta
          name="twitter:description"
          content={"FitHub is a workout tracking app designed for engineers."}
        />
        <meta name="twitter:image" content={`${url}/logo.png`} />
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
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
        <NextScript nonce={nonce} />
      </body>
    </Html>
  );
}
