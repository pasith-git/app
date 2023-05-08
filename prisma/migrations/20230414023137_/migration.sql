/*
  Warnings:

  - You are about to alter the column `bank_percentage` on the `museum_schedule_payments` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.

*/
-- DropForeignKey
ALTER TABLE `contents` DROP FOREIGN KEY `contents_author_id_fkey`;

-- DropForeignKey
ALTER TABLE `contents` DROP FOREIGN KEY `contents_museum_id_fkey`;

-- DropForeignKey
ALTER TABLE `prices` DROP FOREIGN KEY `prices_museum_id_fkey`;

-- AlterTable
ALTER TABLE `museum_schedule_payments` MODIFY `bank_percentage` TINYINT NULL;

-- CreateTable
CREATE TABLE `Booking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `museum_id` INTEGER NOT NULL,
    `schedule` VARCHAR(191) NOT NULL,
    `normal_price` DECIMAL(10, 2) NOT NULL,
    `foreigner_price` DECIMAL(10, 2) NOT NULL,
    `booking_amount_limit` INTEGER NOT NULL DEFAULT 0,
    `active_users` INTEGER NOT NULL DEFAULT 0,
    `discount_type` ENUM('money', 'percent') NOT NULL,
    `discount_amount` DECIMAL(10, 2) NOT NULL,
    `booking_status` ENUM('pending', 'active', 'completed') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Coupon` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(40) NOT NULL,
    `discount_type` ENUM('money', 'percent') NOT NULL,
    `discount_amount` DECIMAL(10, 2) NOT NULL,
    `expired_date` DATETIME(3) NOT NULL,
    `coupon_status` ENUM('pending', 'active', 'expired', 'redeemed') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `contents` ADD CONSTRAINT `contents_museum_id_fkey` FOREIGN KEY (`museum_id`) REFERENCES `museums`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contents` ADD CONSTRAINT `contents_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prices` ADD CONSTRAINT `prices_museum_id_fkey` FOREIGN KEY (`museum_id`) REFERENCES `museums`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_museum_id_fkey` FOREIGN KEY (`museum_id`) REFERENCES `museums`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
