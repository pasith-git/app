/*
  Warnings:

  - You are about to alter the column `bank_name` on the `payment_packages` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(40)`.
  - You are about to alter the column `payment_name` on the `payment_packages` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(40)`.
  - You are about to alter the column `payment_phone` on the `payment_packages` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE `payment_packages` ADD COLUMN `description` TEXT NULL,
    MODIFY `info` TEXT NULL,
    MODIFY `bank_name` VARCHAR(40) NULL,
    MODIFY `payment_name` VARCHAR(40) NULL,
    MODIFY `payment_phone` VARCHAR(20) NULL;
