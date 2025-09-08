import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma"; // adjust for your DB

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // set in .env

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://dev-api.example.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    // Step 1: Find all users with this email
    const users = await prisma.users.findMany({ where: { email } });
    if (!users || users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    let matchedUser = null;

    // Step 2: Check each user
    for (const user of users) {
      let isValid = false;

      // Try bcrypt first
      if (user.password) {
        isValid = await bcrypt.compare(password, user.password);
      }

      // If bcrypt fails → try MD5
      if (!isValid) {
        const md5Hash = crypto.createHash("md5").update(password).digest("hex");
        if (md5Hash === user.password) {
          isValid = true;

          // Upgrade MD5 → bcrypt (if original_password is null)
          if (!user.original_password) {
            const newHash = await bcrypt.hash(password, 10);
            await prisma.users.update({
              where: { id: user.id },
              data: {
                original_password: password,
                password: newHash,
              },
            });
          }
        }
      }

      if (isValid) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Step 3: Generate JWT
    const token = jwt.sign(
      { id: matchedUser.id, email: matchedUser.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      token,
      user: { id: matchedUser.id, email: matchedUser.email },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}


// Get Curriculum
export const getCurriculum = async () => {
  const res = await API.get("/curriculum");
  return res.data;
};