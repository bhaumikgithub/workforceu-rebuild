import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function hashPassword(plain: string) {
  return await bcrypt.hash(plain, 10);
}

export async function compareBcrypt(plain: string, hash: string) {
  return await bcrypt.compare(plain, hash);
}

export function md5Hex(plain: string) {
  return crypto.createHash("md5").update(plain).digest("hex");
}
