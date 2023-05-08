/*
  Warnings:

  - You are about to drop the column `active_users` on the `booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `booking` DROP COLUMN `active_users`,
    ADD COLUMN `user_active` INTEGER NOT NULL DEFAULT 0;
