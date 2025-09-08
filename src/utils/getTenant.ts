import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"

export async function getTenant() {
  //Await headers()
  const headersList = await headers()
  const host = headersList.get("host") || "" // e.g., abc.myapp.com
  const parts = host.split(".")

  //Extract subdomain (ignore localhost or root domain)
  const subdomain =
    parts.length > 2 && !host.includes("localhost") ? parts[0] : null

  if (!subdomain) return null

  //Query subdomains table by domain field
  const tenant = await prisma.subdomains.findUnique({
    where: { domain: subdomain },
  })

  return tenant
}
