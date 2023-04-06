/*
  Warnings:

  - Added the required column `user_limit_status` to the `museum_schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `museum_schedules` ADD COLUMN `user_limit_status` ENUM('available', 'full') NOT NULL;
