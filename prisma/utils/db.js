import mysql from "mysql2/promise";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function createConnections() {
    // 🔗 External DB connection
    const externalDb = await mysql.createConnection({
        host: process.env.EXTERNAL_DB_HOST,
        user: process.env.EXTERNAL_DB_USER,
        password: process.env.EXTERNAL_DB_PASS,
        database: process.env.EXTERNAL_DB_NAME,
    });

    // 🔗 Local DB connection derived from DATABASE_URL
    const url = new URL(process.env.DATABASE_URL);
    const localDb = await mysql.createConnection({
        host: url.hostname,
        port: url.port,
        user: url.username,
        password: url.password,
        database: url.pathname.replace("/", ""),
    });

    return { externalDb, localDb, prisma };
}

export { createConnections, prisma };