import { describe, expect, it } from "vitest";
import { getLiveProviderAdapter } from "@/lib/live/provider";

describe("live provider adapter", () => {
  it("creates mock rooms through the provider-neutral interface", async () => {
    const adapter = getLiveProviderAdapter();
    const room = await adapter.createRoom({ sessionId: "00000000-0000-4000-8000-000000000001", title: "Live class", startsAt: new Date(), endsAt: new Date(Date.now() + 3600000) });

    expect(room.provider).toBe("mock");
    expect(room.providerRoomId).toContain("solco-");
  });

  it("generates role-specific short-lived tokens", async () => {
    const token = await getLiveProviderAdapter().generateToken({ roomId: "room-1", userId: "user-1", role: "attendee", ttlSeconds: 60 });

    expect(token.token.length).toBeGreaterThan(20);
    expect(token.permissions.record).toBe(false);
    expect(token.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });
});
