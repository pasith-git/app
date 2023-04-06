/*
  Warnings:

  - Added the required column `user_limit` to the `payment_museum_schedule_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment_museum_schedule_details` ADD COLUMN `user_limit` INTEGER UNSIGNED NOT NULL;
