/*
  Warnings:

  - Added the required column `total` to the `museum_schedule_payment_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `museum_schedule_payment_details` ADD COLUMN `total` DECIMAL(10, 2) NOT NULL;
