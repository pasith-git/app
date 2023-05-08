/*
  Warnings:

  - You are about to drop the column `user_amount` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `payments` DROP COLUMN `user_amount`,
    ADD COLUMN `adult_amount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `child_amount` INTEGER NOT NULL DEFAULT 0;
