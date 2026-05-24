import { createHash, randomInt } from "node:crypto";

const OTP_TTL_MINUTES = 10;

export function createOtp() {
  const code = randomInt(100000, 1000000).toString();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  return {
    code,
    hash: hashOtp(code),
    expiresAt,
  };
}

export function hashOtp(code: string) {
  return createHash("sha256")
    .update(`${code}:${getOtpSecret()}`)
    .digest("hex");
}

export function isOtpExpired(expiresAt: Date | string | null | undefined) {
  if (!expiresAt) {
    return true;
  }

  return new Date(expiresAt).getTime() < Date.now();
}

function getOtpSecret() {
  return (
    process.env.OTP_SECRET ||
    process.env.USER_SESSION_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.DATABASE_URL ||
    "scentora-local-otp-secret"
  );
}
