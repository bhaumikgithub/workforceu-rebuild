import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
});

export const POST = async (req: NextRequest) => {
    const sig = req.headers.get('stripe-signature')!;
    const body = await req.text();

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    const subscriptionId = (event.data.object as any).id;

    try {
        switch (event.type) {
            case 'customer.subscription.updated':
            case 'customer.subscription.created':
            case 'customer.subscription.deleted':
                const sub = event.data.object as Stripe.Subscription;

                // Update stripe_status based on subscription status
                const isActive = sub.status === 'active' || sub.status === 'trialing';

                // Update subscription in DB
                await prisma.subscription.updateMany({
                    where: { stripe_subscription_id: sub.id },
                    data: {
                        stripe_status: isActive,
                        subscription_start_date: sub.items.data[0].current_period_start
                            ? new Date(sub.items.data[0].current_period_start * 1000)
                            : undefined,
                        subscription_end_date: sub.items.data[0].current_period_end
                            ? new Date(sub.items.data[0].current_period_end * 1000)
                            : undefined,
                    },
                });
                break;

            case 'invoice.payment_failed':
                const invoice = event.data.object as any;
                if (invoice.subscription) {
                    await prisma.subscription.updateMany({
                        where: { stripe_subscription_id: invoice.subscription },
                        data: { stripe_status: false },
                    });
                }
                break;

            case 'invoice.payment_succeeded':
                const paidInvoice = event.data.object as any;
                await prisma.subscription.updateMany({
                    where: { stripe_subscription_id: paidInvoice.subscription as string },
                    data: { stripe_status: true },
                });
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error('Error updating DB from webhook:', err.message);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
};
