import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@resume/shared/api/creem";
import { prisma } from "@/lib/prisma";

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
      const metadata = event.data?.request_metadata || {};
      const userId = metadata.user_id;
      const transactionId = event.data?.id || "unknown";

      if (userId) {
        // Create or update purchase record
        await prisma.purchase.upsert({
          where: {
            id: transactionId,
          },
          update: {
            status: "active",
          },
          create: {
            id: transactionId,
            userId,
            tier: "pro",
            paymentId: transactionId,
            status: "active",
            expiresAt: new Date(
              Date.now() + 365 * 24 * 60 * 60 * 1000
            ), // 1 year from now
          },
        });
      }
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