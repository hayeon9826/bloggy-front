import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { DefaultSeo } from "next-seo";
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        canonical="https://bloggy-front.vercel.app/"
        twitter={{
          site: "Bloggy",
        }}
        openGraph={{
          type: "website",
          locale: "ko_KR",
          url: "https://bloggy-front.vercel.app/",
          siteName: "Bloggy",
          images: [
            {
              url: "https://bloggy-front.vercel.app/images/logo_black_lg.png",
              width: 500,
              height: 500,
              alt: "Bloggy - AI 블로그 플랫폼",
            },
          ],
        }}
      />
      <QueryClientProvider client={queryClient}>
        <Toaster containerClassName="text-sm bg-opacity-75 font-medium" />
        <SessionProvider session={pageProps.session}>
          <Component {...pageProps} />
        </SessionProvider>
      </QueryClientProvider>
    </>
  );
}
