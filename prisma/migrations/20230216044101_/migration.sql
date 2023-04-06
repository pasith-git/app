/*
  Warnings:

  - You are about to drop the `payment_booking_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment_bookings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `payment_booking_details` DROP FOREIGN KEY `payment_booking_details_booking_schedule_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment_booking_details` DROP FOREIGN KEY `payment_booking_details_payment_booking_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment_bookings` DROP FOREIGN KEY `payment_bookings_user_id_fkey`;

-- DropTable
DROP TABLE `payment_booking_details`;

-- DropTable
DROP TABLE `payment_bookings`;

-- CreateTable
CREATE TABLE `payment_museum_schedules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `transaction_id` VARCHAR(191) NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('pending', 'success', 'failure') NOT NULL,
    `payment_type` ENUM('credit', 'cash') NOT NULL,
    `payment_date` DATETIME(3) NOT NULL,
    `image_path` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_museum_schedule_details` (
    `payment_museum_schedule_id` INTEGER NOT NULL,
    `museum_schedule_id` INTEGER NOT NULL,

    PRIMARY KEY (`payment_museum_schedule_id`, `museum_schedule_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `payment_museum_schedules` ADD CONSTRAINT `payment_museum_schedules_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_museum_schedule_details` ADD CONSTRAINT `payment_museum_schedule_details_payment_museum_schedule_id_fkey` FOREIGN KEY (`payment_museum_schedule_id`) REFERENCES `payment_museum_schedules`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_museum_schedule_details` ADD CONSTRAINT `payment_museum_schedule_details_museum_schedule_id_fkey` FOREIGN KEY (`museum_schedule_id`) REFERENCES `museum_schedules`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
