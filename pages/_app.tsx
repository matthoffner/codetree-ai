import "../public/font/stylesheet.css";
import "../styles/iframeLoaderScreen.css";
import "../styles/loaders.css";
import "../styles/globals.css";
import "../styles/customlib/_customTabs.css";
import "../styles/customlib/_customMonacoEditor.css";
import "allotment/dist/style.css";
import "nprogress/nprogress.css";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import App from "next/app";
import type { AppContext, AppProps } from "next/app";
import Script from "next/script";
import { getIronSession, IronSessionData } from "iron-session";
import Router from "next/router";
import NProgress from "nprogress";
import { ApolloProvider } from "@apollo/client";

import { createApolloClient } from "../utils/client";
import { sessionOptions } from "../utils/withSession";
import { store } from "../store/store";
import {
  OauthInput,
  OauthProvider,
  set_initial_user,
  withOauth,
} from "../store/features/authSlice";
import { RootModal } from "../components/Modals/RootModal";

interface MyAppProps extends AppProps {
  initialUser?: IronSessionData["user"] | null;
}

function MyApp({ Component, pageProps, router, initialUser }: MyAppProps) {
  Router.events.on("routeChangeStart", () => NProgress.start());
  Router.events.on("routeChangeComplete", () => NProgress.done());
  Router.events.on("routeChangeError", () => NProgress.done());

  useEffect(() => {
    window.withOauth = function (input: OauthInput, provider: OauthProvider) {
      store.dispatch(withOauth(input, provider));
    };
  }, []);

  useEffect(() => {
    store.dispatch(set_initial_user(initialUser));
  }, [initialUser]);

  return (
    <>
      <ApolloProvider client={createApolloClient()}>
        <Provider store={store}>
          <Component {...pageProps} />
          <RootModal />
        </Provider>
      </ApolloProvider>
    </>
  );
}

export default MyApp;

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  /*
  try {
    if (appContext.ctx.req && appContext.ctx.res) {
      const session = await getIronSession(
        appContext.ctx.req,
        appContext.ctx.res,
        sessionOptions
      );
  
      return {
        ...appProps,
        initialUser: session.user,
      };
    }
  } catch (err) {
    console.warn(err);
  }
  */

  return appProps;
};
