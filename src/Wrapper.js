"use client";

import { SessionProvider } from "next-auth/react";

export const Wrapper = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};
