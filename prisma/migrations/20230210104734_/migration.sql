/*
  Warnings:

  - You are about to drop the column `transactionId` on the `payment_packages` table. All the data in the column will be lost.
  - Added the required column `transaction_id` to the `payment_packages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment_packages` DROP COLUMN `transactionId`,
    ADD COLUMN `transaction_id` VARCHAR(191) NOT NULL;
