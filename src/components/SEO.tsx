import Head from "next/head";
import { FC } from "react";

type SEOProps = {
  title: string;
  description?: string;
  url: string;
  imgUrl?: string;
};

const defaultURL = process.env.NEXT_PUBLIC_VERCEL_URL;

export const SEO: FC<SEOProps> = ({ title, description, url, imgUrl }) => {
  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />
      {description && <meta name="description" content={description} />}
      <meta property="og:url" content={defaultURL + url} />
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />
      <meta
        property="og:image"
        content={imgUrl ? imgUrl : "https://fithub-dev.vercel.app/logo.png"}
      />
    </Head>
  );
};
