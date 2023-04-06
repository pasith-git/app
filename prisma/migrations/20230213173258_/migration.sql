/*
  Warnings:

  - You are about to drop the `booking_schedules` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `booking_schedules` DROP FOREIGN KEY `booking_schedules_museum_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment_booking_details` DROP FOREIGN KEY `payment_booking_details_booking_schedule_id_fkey`;

-- DropTable
DROP TABLE `booking_schedules`;

-- CreateTable
CREATE TABLE `museum_schedules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `description` TEXT NULL,
    `current_users` INTEGER NOT NULL,
    `user_limit` INTEGER NOT NULL,
    `museum_id` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `discount` DECIMAL(10, 2) NULL,
    `status` ENUM('pending', 'active', 'ended') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `museum_schedules` ADD CONSTRAINT `museum_schedules_museum_id_fkey` FOREIGN KEY (`museum_id`) REFERENCES `museums`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_booking_details` ADD CONSTRAINT `payment_booking_details_booking_schedule_id_fkey` FOREIGN KEY (`booking_schedule_id`) REFERENCES `museum_schedules`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
