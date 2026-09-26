import { inngest } from "@/app/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, name } = await req.json();

  // Fake user creation for now

  const user = await inngest.send({
    name: "user/registered",
    data: {
      userId: "user-123",
      email,
      name,
    },
  });

  return NextResponse.json({
    success: true,
    user,
  });
}
