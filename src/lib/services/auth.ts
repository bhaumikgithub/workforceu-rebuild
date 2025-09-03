import { prisma } from "@/lib/prisma";
import { compareBcrypt, hashPassword, md5Hex } from "@/lib/auth-lib";
import jwt from "jsonwebtoken";

/**
 * NEVER return sensitive fields to the client.
 */
function sanitizeUser(u: any) {
  if (!u) return u;
  const { password, original_password, ...rest } = u;
  return rest;
}

export async function login(email: string, password: string) {
  // 1) Find all users with same email (duplicates allowed)
  const candidates = await prisma.users.findMany({ where: { email } });
  if (!candidates.length) throw new Error("Invalid Email");

  let matchedUser: any = null;

  // 2) Try to authenticate each
  for (const user of candidates) {
    let ok = false;

    // Try bcrypt if present
    if (user.password) {
      try {
        ok = await compareBcrypt(password, user.password);
      } catch {
        ok = false;
      }
    }

    // If bcrypt failed, try legacy MD5 (DB 'password' may contain an md5)
    if (!ok && user.password) {
      const md5 = md5Hex(password);
      if (md5 === user.password) {
        ok = true;

        // Upgrade if original_password is empty/null
        if (!user.original_password || user.original_password.trim() === "") {
          const newBcrypt = await hashPassword(password);
          await prisma.users.update({
            where: { id: user.id },
            data: {
              original_password: password, // ⚠️ stores plain password ONCE (your requirement)
              password: newBcrypt,         // upgrade to bcrypt
            },
          });
        }
      }
    }

    // If user.password is null: this user simply can't log in with password (skip)
    if (ok) {
      matchedUser = user;
      break;
    }
  }

  if (!matchedUser) throw new Error("Invalid Credentials");

  // 3) Issue JWT
  const token = jwt.sign(
    { id: matchedUser.id, email: matchedUser.email },
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "1d" }
  );

  return { user: sanitizeUser(matchedUser), token };
}
