/*
  Warnings:

  - Added the required column `price` to the `booking_schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking_schedules` ADD COLUMN `price` DECIMAL(10, 2) NOT NULL;
