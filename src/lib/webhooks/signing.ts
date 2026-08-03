import { createHmac, randomBytes } from "crypto";

export function generateWebhookSecret() {
  return `whsec_${randomBytes(32).toString("base64url")}`;
}

export function hashWebhookSecret(secret: string) {
  return createHmac("sha256", "solva-academy-webhook-secret-hash").update(secret).digest("hex");
}

export function signWebhookPayload(secret: string, payload: string, timestamp = Math.floor(Date.now() / 1000)) {
  const signature = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  return `t=${timestamp},v1=${signature}`;
}

export function verifyWebhookSignature(secret: string, payload: string, header: string, toleranceSeconds = 300) {
  const parts = Object.fromEntries(header.split(",").map((part) => {
    const [key, value] = part.split("=");
    return [key, value];
  }));
  const timestamp = Number(parts.t);
  if (!timestamp || Math.abs(Date.now() / 1000 - timestamp) > toleranceSeconds) return false;
  return signWebhookPayload(secret, payload, timestamp) === header;
}
