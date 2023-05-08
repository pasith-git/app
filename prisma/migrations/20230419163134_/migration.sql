/*
  Warnings:

  - You are about to drop the column `foreigner_price` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `normal_price` on the `bookings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `bookings` DROP COLUMN `foreigner_price`,
    DROP COLUMN `normal_price`;
