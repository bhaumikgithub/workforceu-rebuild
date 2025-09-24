import { main as permissionSeeder } from "./seeder/permissionSeeder.js";

async function run() {
    console.log("🌱 Starting seeding...");
    await permissionSeeder();
    console.log("🌱 All seeds completed successfully");
}

run()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("❌ Global seeding failed:", err);
        process.exit(1);
    });