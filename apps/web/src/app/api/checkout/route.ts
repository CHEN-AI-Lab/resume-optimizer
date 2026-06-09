import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@resume/shared/api/creem";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const userId = body?.userId as string | undefined;
    const checkoutUrl = await createCheckoutSession(userId);
    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("Checkout API error:", error);
    const message =
      error instanceof Error ? error.message : "支付会话创建失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}