/*
  Warnings:

  - You are about to drop the column `bank_pecentage` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `bank_pecentage_amount` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `payments` DROP COLUMN `bank_pecentage`,
    DROP COLUMN `bank_pecentage_amount`,
    ADD COLUMN `bank_percentage` DECIMAL(10, 2) NULL,
    ADD COLUMN `bank_percentage_amount` DECIMAL(10, 2) NULL;
