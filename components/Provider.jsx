"use client";

import { SessionPRovider, SessionProvider } from 'next-auth/react';

function Provider({ children, session }) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}

export default Provider