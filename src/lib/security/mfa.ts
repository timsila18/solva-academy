export function generateBackupCodes(count = 10) {
  return Array.from({ length: count }, (_, index) => `SA-${String(index + 1).padStart(2, "0")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`);
}

export function maskSessionFingerprint(fingerprint: string) {
  if (fingerprint.length <= 8) return "********";
  return `${fingerprint.slice(0, 4)}...${fingerprint.slice(-4)}`;
}

export function isSecurityEventHighRisk(eventType: string) {
  return ["failed_login_spike", "mfa_disabled", "password_reset", "new_device", "admin_access", "session_revoked"].includes(eventType);
}
