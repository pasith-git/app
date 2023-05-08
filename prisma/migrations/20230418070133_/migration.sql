/*
  Warnings:

  - A unique constraint covering the columns `[confirmed_image_path]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `payments` ADD COLUMN `confirmed_image_path` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `payments_confirmed_image_path_key` ON `payments`(`confirmed_image_path`);
