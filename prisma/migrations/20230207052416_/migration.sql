/*
  Warnings:

  - You are about to alter the column `last_login` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `last_login` DATETIME NULL;
