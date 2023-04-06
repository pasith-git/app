/*
  Warnings:

  - Made the column `payment_date` on table `payment_packages` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `payment_packages` MODIFY `payment_date` DATETIME(3) NOT NULL;
