-- DropIndex
DROP INDEX `departments_subdomain_id_fkey` ON `departments`;

-- DropIndex
DROP INDEX `locations_subdomain_id_fkey` ON `locations`;

-- DropIndex
DROP INDEX `states_country_id_fkey` ON `states`;

-- DropIndex
DROP INDEX `subdomains_company_type_id_fkey` ON `subdomains`;

-- DropIndex
DROP INDEX `users_owner_id_fkey` ON `users`;

-- CreateTable
CREATE TABLE `subscriptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `plan_id` VARCHAR(191) NULL,
    `user_id` INTEGER NULL,
    `subscription_id` VARCHAR(191) NULL,
    `subscription_start_date` DATETIME(3) NULL,
    `subscription_end_date` DATETIME(3) NULL,
    `employee_limit` VARCHAR(191) NULL,
    `customer_id` VARCHAR(191) NULL,
    `coupan_id` VARCHAR(191) NULL,
    `interval` VARCHAR(191) NULL,
    `plan_name` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `invoice_id` VARCHAR(191) NULL,
    `amount` DOUBLE NULL DEFAULT 0,
    `last_payment_attempted_date` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_methods` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `stripe_payment_method_id` VARCHAR(191) NOT NULL,
    `card_brand` VARCHAR(191) NULL,
    `card_last4` VARCHAR(191) NULL,
    `card_exp_month` INTEGER NULL,
    `card_exp_year` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_subdomain_id_fkey` FOREIGN KEY (`subdomain_id`) REFERENCES `subdomains`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_state_id_fkey` FOREIGN KEY (`state_id`) REFERENCES `states`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_time_zone_id_fkey` FOREIGN KEY (`time_zone_id`) REFERENCES `timezones`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subdomains` ADD CONSTRAINT `subdomains_company_type_id_fkey` FOREIGN KEY (`company_type_id`) REFERENCES `company_types`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `departments` ADD CONSTRAINT `departments_subdomain_id_fkey` FOREIGN KEY (`subdomain_id`) REFERENCES `subdomains`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `locations` ADD CONSTRAINT `locations_subdomain_id_fkey` FOREIGN KEY (`subdomain_id`) REFERENCES `subdomains`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `states` ADD CONSTRAINT `states_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_methods` ADD CONSTRAINT `payment_methods_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
