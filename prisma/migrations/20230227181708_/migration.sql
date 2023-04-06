/*
  Warnings:

  - You are about to alter the column `current_users` on the `museum_schedules` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedInt`.
  - You are about to alter the column `user_limit` on the `museum_schedules` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedInt`.

*/
-- AlterTable
ALTER TABLE `museum_schedules` MODIFY `current_users` INTEGER UNSIGNED NOT NULL,
    MODIFY `user_limit` INTEGER UNSIGNED NOT NULL;
