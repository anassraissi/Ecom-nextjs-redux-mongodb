"use client";

import { signIn, useSession } from "next-auth/react";
import { use } from "react";


export default function Login() {
  const { data: session } = useSession();

  if (session) {
    return <p>Welcome, {session.user.name}</p>;
  }

  return <button onClick={() => signIn("google")}>Sign in with Google</button>;
}
