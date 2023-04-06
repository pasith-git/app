/*
  Warnings:

  - Added the required column `status` to the `booking_schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking_schedules` ADD COLUMN `status` ENUM('pending', 'active', 'ended') NOT NULL;
