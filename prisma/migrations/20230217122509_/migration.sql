/*
  Warnings:

  - You are about to drop the column `payment_name` on the `payment_packages` table. All the data in the column will be lost.
  - You are about to drop the column `payment_phone` on the `payment_packages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `payment_packages` DROP COLUMN `payment_name`,
    DROP COLUMN `payment_phone`,
    ADD COLUMN `payment_bank_bill_name` VARCHAR(191) NULL,
    ADD COLUMN `payment_bank_bill_phone` VARCHAR(20) NULL;
