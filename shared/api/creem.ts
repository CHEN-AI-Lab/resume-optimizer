export async function createCheckoutSession(): Promise<string> {
  const apiKey = process.env.CREEM_API_KEY;
  const productId = process.env.CREEM_PRODUCT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!apiKey || !productId) {
    throw new Error("Payment not configured");
  }

  const response = await fetch("https://api.creem.io/v1/checkouts", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: productId,
      success_url: `${appUrl}/success`,
      cancel_url: `${appUrl}/analyze`,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Creem checkout error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.checkout_url;
}

export async function verifyWebhookSignature(
  body: string,
  signature: string | null
): Promise<boolean> {
  if (!signature) return false;
  const webhookSecret = process.env.CREEM_WEBHOOK_SECRET;
  if (!webhookSecret) return false;

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(webhookSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const expected = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(body)
    );
    const expectedHex = Array.from(new Uint8Array(expected))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return signature === expectedHex;
  } catch {
    return false;
  }
}