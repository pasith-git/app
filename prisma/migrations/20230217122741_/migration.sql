/*
  Warnings:

  - You are about to drop the column `bank_percent_tag` on the `payment_packages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `payment_packages` DROP COLUMN `bank_percent_tag`,
    ADD COLUMN `bank_percentage` INTEGER NULL;
