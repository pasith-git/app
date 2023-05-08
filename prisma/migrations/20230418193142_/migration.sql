/*
  Warnings:

  - You are about to drop the column `is_scanned` on the `payment_details` table. All the data in the column will be lost.
  - Added the required column `is_printed` to the `payment_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment_details` DROP COLUMN `is_scanned`,
    ADD COLUMN `is_printed` BOOLEAN NOT NULL;
