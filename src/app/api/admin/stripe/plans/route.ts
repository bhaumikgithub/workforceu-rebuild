import { NextResponse } from "next/server";
import Stripe from "stripe";

// Use the Stripe secret key (never use publishable key here)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
});

export async function GET() {
    try {
      // Get subscription prices/plans
      const prices = await stripe.prices.list({
        active: true,
        expand: ["data.product"],
        limit: 100
      });

      // Get coupons
      const coupons = await stripe.coupons.list({ limit: 50 });

      return NextResponse.json({
        plans: prices.data.map((price) => ({
          id: price.id,
          nickname:
            (price.nickname as string) ||
            ((price.product as Stripe.Product)?.name ?? "Unnamed Plan"),
          amount: (price.unit_amount ?? 0) / 100,
          currency: price.currency.toUpperCase(),
          interval: price.recurring?.interval,
        })),
        coupons: coupons.data.map((coupon) => ({
          id: coupon.id,
          name: coupon.name ?? coupon.id,
          percent_off: coupon.percent_off,
          amount_off: coupon.amount_off,
        })),
      });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
