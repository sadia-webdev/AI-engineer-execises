import { NextResponse } from "next/server";
import { inngest } from "@/app/inngest/client";

export async function POST() {
  await inngest.send({
    name: "user/verified",
    data: {
      userId: "user-123",
    },
  });

  return NextResponse.json({
    success: true,
    message: "Verification event sent",
  });
}

