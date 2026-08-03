import crypto from "node:crypto";

export type LiveRole = "host" | "co_host" | "moderator" | "presenter" | "attendee" | "viewer" | "child_participant" | "guardian_observer";

export type LiveRoom = {
  provider: string;
  providerRoomId: string;
  roomUrl: string;
};

export type LiveToken = {
  token: string;
  expiresAt: Date;
  permissions: Record<string, boolean>;
};

export interface LiveProviderAdapter {
  provider: string;
  createRoom(input: { sessionId: string; title: string; startsAt: Date; endsAt: Date; capacity?: number | null }): Promise<LiveRoom>;
  generateToken(input: { roomId: string; userId: string; role: LiveRole; ttlSeconds: number }): Promise<LiveToken>;
  verifyWebhookSignature(payload: string, signature?: string | null): boolean;
  normalizeWebhook(payload: unknown): { eventId: string; eventType: string; sessionId?: string; occurrenceId?: string; raw: unknown };
}

function permissionsForRole(role: LiveRole) {
  const host = ["host", "co_host", "moderator"].includes(role);
  return {
    microphone: role !== "viewer",
    camera: role !== "viewer",
    screenShare: host || role === "presenter",
    chat: role !== "child_participant",
    privateChat: false,
    record: host,
    admit: host,
    moderate: host,
    whiteboard: host || role === "presenter",
    breakout: role !== "viewer",
  };
}

class MockSolcoAdapter implements LiveProviderAdapter {
  provider = "mock";

  async createRoom(input: { sessionId: string; title: string }) {
    const providerRoomId = `solco-${input.sessionId.slice(0, 8)}`;
    return {
      provider: this.provider,
      providerRoomId,
      roomUrl: `/live/classroom/${input.sessionId}`,
    };
  }

  async generateToken(input: { roomId: string; userId: string; role: LiveRole; ttlSeconds: number }) {
    const expiresAt = new Date(Date.now() + input.ttlSeconds * 1000);
    const payload = JSON.stringify({ roomId: input.roomId, userId: input.userId, role: input.role, exp: expiresAt.toISOString() });
    return {
      token: Buffer.from(payload).toString("base64url"),
      expiresAt,
      permissions: permissionsForRole(input.role),
    };
  }

  verifyWebhookSignature(payload: string, signature?: string | null) {
    const secret = process.env.SOLCO_WEBHOOK_SECRET;
    if (!secret) return true;
    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature ?? ""));
  }

  normalizeWebhook(payload: unknown) {
    const event = payload as { id?: string; type?: string; session_id?: string; occurrence_id?: string };
    return {
      eventId: event.id ?? crypto.randomUUID(),
      eventType: event.type ?? "unknown",
      sessionId: event.session_id,
      occurrenceId: event.occurrence_id,
      raw: payload,
    };
  }
}

export function getLiveProviderAdapter(): LiveProviderAdapter {
  return new MockSolcoAdapter();
}
