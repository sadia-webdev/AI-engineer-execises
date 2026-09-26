"use client";

import { useState } from "react";

export default function VerifyPage() {
  const [status, setStatus] = useState("Waiting for verification...");

  async function handleVerify() {
    setStatus("Verifying...");

    const response = await fetch("/api/users/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "user-123",
      }),
    });

    const data = await response.json();

    if (data.success) {
      setStatus("Verification event sent! ⏳");
    } else {
      setStatus("Verification failed");
    }
  }

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-2 text-3xl font-bold">
        Verify your account
      </h1>


      <button
        onClick={handleVerify}
        className="w-full rounded bg-blue-400 p-3 text-white"
      >
        Verify Account
      </button>

      <p className="mt-4">
        Status: <strong>{status}</strong>
      </p>
    </main>
  );
}
