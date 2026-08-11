"use client";

import { authClient, useSession } from "@/lib/authClient";
import Link from "next/link";

const ClientDashboard = () => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div>loading...</div>;
  }

  if (!session) {
    return <div>not logged in please <Link href="/auth/sign-in?provider=email-password">login</Link></div>;
  }

  return (
    <div>
      <h1>Client Dashboard</h1>
      <p>Email: {session.user.email}</p>
      <p>Name: {session.user.name}</p>
      <p>ID: {session.user.id}</p>
      <p>Email Verified: {session.user.emailVerified ? "Yes" : "No"}</p>
      <p>Image: {session.user.image}</p>
      <br />
      <button
        onClick={() => authClient.signOut()}
        className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
      >
        Sign Out
      </button>
    </div>
  );
};

export default ClientDashboard;
