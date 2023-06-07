/*
  Warnings:

  - A unique constraint covering the columns `[confirmed_image_path]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `bookings` ADD COLUMN `confirmed_image_path` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `bookings_confirmed_image_path_key` ON `bookings`(`confirmed_image_path`);
