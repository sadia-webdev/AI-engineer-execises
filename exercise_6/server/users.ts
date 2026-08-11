"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// server/users.ts
export async function getUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error) {
    console.error("Failed to retrieve user session:", error);
    return null; 
  }
}

// Signup
export async function signup(email: string, password: string) {
  const user = await auth.api.signUpEmail({
    body: {
      name: email.split("@")[0],
      email,
      password,
    },
  });
  return user;
}

// Login
export async function login(email: string, password: string) {
  await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });
}


