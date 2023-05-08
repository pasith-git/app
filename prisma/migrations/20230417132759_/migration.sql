/*
  Warnings:

  - You are about to drop the column `schedule` on the `booking` table. All the data in the column will be lost.
  - Added the required column `schedule_date` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schedule_time` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` DROP COLUMN `schedule`,
    ADD COLUMN `schedule_date` DATE NOT NULL,
    ADD COLUMN `schedule_time` VARCHAR(191) NOT NULL;
