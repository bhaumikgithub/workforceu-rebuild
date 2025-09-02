-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subdomain_id` INTEGER NULL,
    `first_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `user_name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `password` TEXT NULL,
    `original_password` TEXT NULL,
    `mobile` VARCHAR(50) NULL,
    `phone_number` VARCHAR(50) NULL,
    `address` TEXT NULL,
    `address_2` TEXT NULL,
    `city` VARCHAR(75) NULL,
    `state_id` INTEGER NULL,
    `country_id` INTEGER NULL,
    `zip_code` VARCHAR(20) NULL,
    `time_zone_id` INTEGER NULL,
    `gender` VARCHAR(191) NULL,
    `birth_date` DATETIME(3) NULL,
    `fax` VARCHAR(50) NULL,
    `email_verified_at` TIMESTAMP(0) NULL,
    `profile_headshot` VARCHAR(191) NULL,
    `company_logo` VARCHAR(191) NULL,
    `user_type` ENUM('super_admin', 'admin', 'po_user', 'so_user') NULL,
    `owner_id` INTEGER NULL,
    `department_id` INTEGER NULL,
    `location_id` INTEGER NULL,
    `position` VARCHAR(75) NULL,
    `pay_type` ENUM('hourly', 'flat_rate') NULL,
    `review_date` DATETIME(3) NULL,
    `reimbursement` VARCHAR(75) NULL,
    `date_employed` DATETIME(3) NULL,
    `hire_date` DATETIME(3) NULL,
    `salary` VARCHAR(75) NULL,
    `status` ENUM('active', 'inactive', 'terminate', 'ban') NULL DEFAULT 'active',
    `remember_token` VARCHAR(100) NULL,
    `account_type` INTEGER NULL,
    `reminder_messenger_emails` ENUM('yes', 'no') NULL,
    `reminder_task_notification_emails` ENUM('yes', 'no') NULL,
    `last_login` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `users_subdomain_id_idx`(`subdomain_id`),
    INDEX `users_state_id_idx`(`state_id`),
    INDEX `users_country_id_idx`(`country_id`),
    INDEX `users_time_zone_id_idx`(`time_zone_id`),
    INDEX `users_department_id_idx`(`department_id`),
    INDEX `users_location_id_idx`(`location_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subdomains` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `domain` VARCHAR(191) NOT NULL,
    `company_type_id` INTEGER NULL,
    `theme_config` VARCHAR(255) NULL,
    `status` ENUM('active', 'inactive') NULL,
    `regular_hours` INTEGER NULL,
    `week_start_day` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subdomain_id` INTEGER NOT NULL,
    `department_name` VARCHAR(255) NOT NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `locations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subdomain_id` INTEGER NOT NULL,
    `location_name` VARCHAR(255) NOT NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `countries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `created_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `deleted_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `states` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `country_id` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `timezones` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `utc` VARCHAR(191) NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` TEXT NOT NULL,
    `description` LONGTEXT NOT NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
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
