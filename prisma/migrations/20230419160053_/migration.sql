/*
  Warnings:

  - You are about to drop the column `museum_id` on the `prices` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `prices` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[amount,booking_id,age_group,is_foreigner]` on the table `prices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `age_group` to the `prices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `booking_id` to the `prices` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `prices` DROP FOREIGN KEY `prices_museum_id_fkey`;

-- AlterTable
ALTER TABLE `prices` DROP COLUMN `museum_id`,
    DROP COLUMN `title`,
    ADD COLUMN `age_group` ENUM('child', 'adult') NOT NULL,
    ADD COLUMN `booking_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `prices_amount_booking_id_age_group_is_foreigner_key` ON `prices`(`amount`, `booking_id`, `age_group`, `is_foreigner`);

-- AddForeignKey
ALTER TABLE `prices` ADD CONSTRAINT `prices_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
