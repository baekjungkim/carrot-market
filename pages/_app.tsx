import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import useUser from "@libs/client/useUser";

function MyApp({ Component, pageProps }: AppProps) {
  const {} = useUser({ publicRoute: ["/enter"] });

  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url).then(async (response) => response.json()),
      }}
    >
      <div className="mx-auto w-full max-w-xl">
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}

export default MyApp;
