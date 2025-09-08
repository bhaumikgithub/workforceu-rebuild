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
  const tenant = await prisma.subdomains.findFirst({ where: { domain } });
  if (!tenant) throw new Error(`Credentials do not match this domain "${domain}"`);

  // 2️⃣ Check if email exists globally
  const emailExists = await prisma.users.findFirst({ where: { email } });
  if (!emailExists) throw new Error("Email does not exist in the system");

  // 3️⃣ Check if email exists under this tenant
  const candidates = await prisma.users.findMany({
    where: { email, subdomain_id: tenant.id },
  });

  if (!candidates.length) {
    // Email exists but not under this domain
    throw new Error(`Email "${email}" does not exist under domain "${domain}"`);
  }

  // 4️⃣ Attempt password verification
  let matchedUser: any = null;

  for (const user of candidates) {
    let ok = false;

    // bcrypt verification
    if (user.password) {
      try {
        ok = await compareBcrypt(password, user.password);
      } catch {
        ok = false;
      }
    }

    // legacy MD5 verification
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
              original_password: password,
              password: newBcrypt,
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

  if (!matchedUser) {
    // Email + domain found but password incorrect
    throw new Error("Password is incorrect");
  }

  // 5️⃣ Issue JWT
  const token = jwt.sign(
    { id: matchedUser.id, email: matchedUser.email, subdomain_id: tenant.id },
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "1d" }
  );

  return { user: sanitizeUser(matchedUser), token };
}
