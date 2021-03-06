import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import useUser from "@libs/client/useUser";
import Router from "next/router";
import NProgress from "nprogress";
import { useEffect } from "react";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  console.log("APP IS RUNNING");

  useEffect(() => {
    const start = () => {
      NProgress.start();
    };
    const end = () => {
      NProgress.done();
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

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
      <Script
        src="https://developers.kakao.com/sdk/js/kakao.js"
        strategy="lazyOnload"
      />
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        onLoad={() => {
          window.fbAsyncInit = function () {
            // FB.init({
            //   appId: "your-app-id",
            //   autoLogAppEvents: true,
            //   xfbml: true,
            //   version: "v13.0",
            // });
          };
        }}
      />
    </SWRConfig>
  );
}

export default MyApp;
