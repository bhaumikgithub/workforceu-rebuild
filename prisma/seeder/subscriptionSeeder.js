import { createConnections, prisma } from "../utils/db.js";

export async function main() {
    const { externalDb, localDb } = await createConnections();

    const [subscriptions] = await externalDb.execute("SELECT * FROM subscriptions");

    for (const subscription of subscriptions) {
        // Convert is_active (int/str) -> boolean
        const stripe_status =
            subscription.is_active === 1 || subscription.is_active === "1" || subscription.is_active === true;
        await prisma.subscription.create({
            data: {
                id: subscription.id,
                plan_id: subscription.plan_id,
                user_id: subscription.member_id,
                stripe_subscription_id: subscription.subscription_id,
                subscription_start_date: subscription.subscription_start_date,
                subscription_end_date: subscription.subscription_end_date,
                employee_limit: subscription.employee_limit,
                customer_id: subscription.customer_id,
                coupan_id: subscription.coupan_id,
                interval: subscription.interval,
                plan_name: subscription.plan_name,
                stripe_status: stripe_status,
                invoice_id: subscription.invoice_id,
                amount: subscription.amount,
                last_payment_attempted_date: subscription.last_payment_attempted_date,
                created_at: subscription.created_at || new Date(),
                updated_at: subscription.updated_at || new Date(),
                deleted_at: null,
            },
        });
    }

    console.log("✅ Subscription seed complete");

    await externalDb.end();
    await localDb.end();
}
