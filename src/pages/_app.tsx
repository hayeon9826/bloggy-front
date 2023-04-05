import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import "react-tooltip/dist/react-tooltip.css";
const queryClient = new QueryClient();
import * as amplitude from "@amplitude/analytics-browser";

amplitude.init(process.env.AMPLITUDE_KEY as string, undefined, {
  defaultTracking: { sessions: true, pageViews: true, formInteractions: true, fileDownloads: true },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster containerClassName="text-sm bg-opacity-75 font-medium" />
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  );
}
