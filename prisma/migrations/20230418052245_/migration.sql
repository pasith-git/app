/*
  Warnings:

  - You are about to drop the `booking` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_museum_id_fkey`;

-- DropTable
DROP TABLE `booking`;

-- CreateTable
CREATE TABLE `bookings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `museum_id` INTEGER NOT NULL,
    `schedule_time` VARCHAR(191) NOT NULL,
    `schedule_date` DATE NOT NULL,
    `normal_price` DECIMAL(10, 2) NOT NULL,
    `foreigner_price` DECIMAL(10, 2) NOT NULL,
    `booking_amount_limit` INTEGER NOT NULL DEFAULT 0,
    `user_active` INTEGER NOT NULL DEFAULT 0,
    `discount_type` ENUM('money', 'percent') NULL,
    `discount_amount` DECIMAL(10, 2) NULL,
    `booking_status` ENUM('pending', 'active', 'completed') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `bookings_schedule_time_schedule_date_museum_id_key`(`schedule_time`, `schedule_date`, `museum_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_museum_id_fkey` FOREIGN KEY (`museum_id`) REFERENCES `museums`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
