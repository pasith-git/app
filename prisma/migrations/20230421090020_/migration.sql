/*
  Warnings:

  - You are about to drop the column `booking_id` on the `prices` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[amount,age_group,is_foreigner,museum_id]` on the table `prices` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title,start_time,end_time,museum_id,capacity_limit]` on the table `schedule_times` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `capacity_limit` to the `schedule_times` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `prices` DROP FOREIGN KEY `prices_booking_id_fkey`;

-- DropIndex
DROP INDEX `prices_amount_booking_id_age_group_is_foreigner_museum_id_key` ON `prices`;

-- DropIndex
DROP INDEX `schedule_times_title_start_time_end_time_museum_id_key` ON `schedule_times`;

-- AlterTable
ALTER TABLE `prices` DROP COLUMN `booking_id`;

-- AlterTable
ALTER TABLE `schedule_times` ADD COLUMN `capacity_limit` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `prices_amount_age_group_is_foreigner_museum_id_key` ON `prices`(`amount`, `age_group`, `is_foreigner`, `museum_id`);

-- CreateIndex
CREATE UNIQUE INDEX `schedule_times_title_start_time_end_time_museum_id_capacity__key` ON `schedule_times`(`title`, `start_time`, `end_time`, `museum_id`, `capacity_limit`);
