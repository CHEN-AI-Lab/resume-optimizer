import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DAILY_LIMIT = 3;

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ authenticated: false, pro: false, used: 0, remaining: 0 });
    }

    const userId = session.user.id;

    // Check pro status
    const activePurchase = await prisma.purchase.findFirst({
      where: {
        userId,
        status: "active",
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: new Date() } },
        ],
      },
    });

    const isPro = !!activePurchase;

    // Count today's usage from a simple approach — use localStorage for daily count
    // (the API records would need a new model; keep it simple for MVP)
    // Actually, let's track daily usage in the DB via the Purchase model usage.
    // For now, return pro status and let the frontend track daily usage locally.

    return NextResponse.json({
      authenticated: true,
      pro: isPro,
    });
  } catch (error) {
    console.error("User status error:", error);
    return NextResponse.json(
      { error: "Failed to get user status" },
      { status: 500 }
    );
  }
}