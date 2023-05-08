/*
  Warnings:

  - You are about to drop the column `booking_status` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `status` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bookings` DROP COLUMN `booking_status`,
    ADD COLUMN `status` ENUM('pending', 'active', 'completed') NOT NULL;
