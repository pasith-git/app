/*
  Warnings:

  - You are about to drop the column `adult_amount` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `adult_price` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `child_amount` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `child_price` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `payments` DROP COLUMN `adult_amount`,
    DROP COLUMN `adult_price`,
    DROP COLUMN `child_amount`,
    DROP COLUMN `child_price`,
    ADD COLUMN `adult_total` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `child_total` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `number_of_adult` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `number_of_child` INTEGER NOT NULL DEFAULT 0;
