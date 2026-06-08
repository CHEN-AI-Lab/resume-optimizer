import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "../../../lib/creem";

export async function POST(_request: NextRequest) {
  try {
    const checkoutUrl = await createCheckoutSession();
    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("Checkout API error:", error);
    const message =
      error instanceof Error ? error.message : "支付会话创建失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}