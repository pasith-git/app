/*
  Warnings:

  - You are about to drop the column `booking_amount_limit` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `schedule_time` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `user_active` on the `bookings` table. All the data in the column will be lost.
  - The values [active,completed] on the enum `payments_status` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `booked_at` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_foreigner` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `people_amount` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schedule_time_id` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schedule_time_str` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `way` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `bookings_schedule_time_schedule_date_museum_id_key` ON `bookings`;

-- AlterTable
ALTER TABLE `bookings` DROP COLUMN `booking_amount_limit`,
    DROP COLUMN `schedule_time`,
    DROP COLUMN `user_active`,
    ADD COLUMN `adult_total` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `booked_at` DATETIME(3) NOT NULL,
    ADD COLUMN `child_total` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `is_foreigner` BOOLEAN NOT NULL,
    ADD COLUMN `number_of_adult` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `number_of_child` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `paid_at` DATETIME(3) NULL,
    ADD COLUMN `people_amount` INTEGER NOT NULL,
    ADD COLUMN `schedule_time_id` INTEGER NOT NULL,
    ADD COLUMN `schedule_time_str` VARCHAR(191) NOT NULL,
    ADD COLUMN `total` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `total_charge` DECIMAL(10, 2) NULL,
    ADD COLUMN `total_pay` DECIMAL(10, 2) NULL,
    ADD COLUMN `total_with_discount` DECIMAL(10, 2) NULL,
    ADD COLUMN `type` ENUM('bank', 'cash') NOT NULL,
    ADD COLUMN `vat_amount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `vat_percentage` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `way` ENUM('booking', 'walkin') NOT NULL,
    MODIFY `status` ENUM('pending', 'success', 'failure') NOT NULL;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_schedule_time_id_fkey` FOREIGN KEY (`schedule_time_id`) REFERENCES `schedule_times`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
