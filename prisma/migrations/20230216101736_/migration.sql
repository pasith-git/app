/*
  Warnings:

  - You are about to drop the column `type` on the `payment_packages` table. All the data in the column will be lost.
  - Added the required column `payment_type` to the `payment_packages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment_packages` DROP COLUMN `type`,
    ADD COLUMN `payment_type` ENUM('bank', 'cash') NOT NULL;
