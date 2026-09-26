"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Not registered");

  const router = useRouter();

  async function handleRegister() {
    setStatus("Registering...");

    const response = await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
      }),
    });

    const data = await response.json();

    if (data.success) {
      setStatus("Registration successful!");

      router.push("/verify");
    } else {
      setStatus("Registration failed");
    }
  }

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-3xl font-bold">
        User Registration
      </h1>

      <div className="space-y-4">
        <input
          className="w-full rounded border p-3"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full rounded border p-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full rounded bg-black p-3 text-white"
        >
          Register
        </button>

        <p>
          Status: <strong>{status}</strong>
        </p>
      </div>
    </main>
  );
}