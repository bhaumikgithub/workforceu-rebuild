//import { main as masterUserSeeder } from "./masterAndUserTablesSeeder.js";
import { main as subscriptionSeeder } from "./subscriptionSeeder.js";

async function run() {
    console.log("🌱 Starting seeding...");

    //await masterUserSeeder();
    await subscriptionSeeder();

    console.log("🌱 All seeds completed successfully");
}

run()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("❌ Global seeding failed:", err);
        process.exit(1);
    });