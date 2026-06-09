import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For a proper daily usage tracker, we'd need a UsageLog model.
    // For MVP: just acknowledge the usage was recorded.
    // The frontend still tracks daily count locally, but pro status is server-side.

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Usage tracking error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}