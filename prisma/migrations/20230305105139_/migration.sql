/*
  Warnings:

  - You are about to drop the `payment_museum_schedule_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment_museum_schedules` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `payment_museum_schedule_details` DROP FOREIGN KEY `payment_museum_schedule_details_museum_schedule_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment_museum_schedule_details` DROP FOREIGN KEY `payment_museum_schedule_details_payment_museum_schedule_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment_museum_schedules` DROP FOREIGN KEY `payment_museum_schedules_user_id_fkey`;

-- DropTable
DROP TABLE `payment_museum_schedule_details`;

-- DropTable
DROP TABLE `payment_museum_schedules`;

-- CreateTable
CREATE TABLE `museum_schedule_payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `transaction_id` VARCHAR(191) NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('pending', 'success', 'failure') NOT NULL,
    `bank_name` VARCHAR(40) NULL,
    `payment_type` ENUM('bank', 'cash') NOT NULL,
    `payment_date` DATETIME(3) NOT NULL,
    `payment_bank_bill_name` VARCHAR(191) NULL,
    `payment_bank_bill_number` VARCHAR(191) NULL,
    `payment_bank_bill_phone` VARCHAR(20) NULL,
    `reference_number` VARCHAR(191) NULL,
    `bank_percentage` INTEGER NULL,
    `bank_percent_amount` DECIMAL(10, 2) NULL,
    `image_path` VARCHAR(191) NULL,
    `info` TEXT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `museum_schedule_payment_details` (
    `payment_museum_schedule_id` INTEGER NOT NULL,
    `museum_schedule_id` INTEGER NOT NULL,
    `user_limit` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`payment_museum_schedule_id`, `museum_schedule_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `museum_schedule_payments` ADD CONSTRAINT `museum_schedule_payments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `museum_schedule_payment_details` ADD CONSTRAINT `museum_schedule_payment_details_payment_museum_schedule_id_fkey` FOREIGN KEY (`payment_museum_schedule_id`) REFERENCES `museum_schedule_payments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `museum_schedule_payment_details` ADD CONSTRAINT `museum_schedule_payment_details_museum_schedule_id_fkey` FOREIGN KEY (`museum_schedule_id`) REFERENCES `museum_schedules`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
