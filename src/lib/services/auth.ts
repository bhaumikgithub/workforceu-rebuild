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

export async function login(email: string, password: string, domain: string) {
  // 1️⃣ Find tenant by domain
  const tenant = await prisma.subdomains.findFirst({
    where: { domain },
  });
  if (!tenant) throw new Error("Credentials do not match this domain");

  // 2️⃣ Find all users under this tenant with the email
  const candidates = await prisma.users.findMany({
    where: { email, subdomain_id: tenant.id },
  });
  if (!candidates.length) throw new Error("Credentials do not match this domain");

  let matchedUser: any = null;

  // 3️⃣ Try to authenticate each candidate
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

    // If bcrypt failed, try legacy MD5
    if (!ok && user.password) {
      const md5 = md5Hex(password);
      if (md5 === user.password) {
        ok = true;

        // Upgrade password to bcrypt if original_password empty
        if (!user.original_password || user.original_password.trim() === "") {
          const newBcrypt = await hashPassword(password);
          await prisma.users.update({
            where: { id: user.id },
            data: {
              original_password: password, // store plain password ONCE
              password: newBcrypt,         // upgrade to bcrypt
            },
          });
        }
      }
    }

    if (ok) {
      matchedUser = user;
      break;
    }
  }

  if (!matchedUser) throw new Error("Credentials do not match this domain");

  // 4️⃣ Issue JWT
  const token = jwt.sign(
    { id: matchedUser.id, email: matchedUser.email, subdomain_id: tenant.id },
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "1d" }
  );

  return { user: sanitizeUser(matchedUser), token };
}
