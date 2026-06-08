import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "../../../../lib/creem";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("creem-signature");

    const isValid = await verifyWebhookSignature(body, signature);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.type === "checkout.completed") {
      const customerEmail = event.data?.customer?.email || "unknown";
      // Payment completed - customer upgraded to Pro
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook handler error" },
      { status: 400 }
    );
  }
}