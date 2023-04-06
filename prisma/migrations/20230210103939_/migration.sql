/*
  Warnings:

  - Added the required column `transactionId` to the `payment_packages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment_packages` ADD COLUMN `transactionId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `last_login` DATETIME(3) NULL;
