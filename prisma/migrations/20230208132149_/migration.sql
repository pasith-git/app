/*
  Warnings:

  - You are about to alter the column `last_login` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_branch_id_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_museum_id_fkey`;

-- AlterTable
ALTER TABLE `users` MODIFY `last_login` DATETIME NULL;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_museum_id_fkey` FOREIGN KEY (`museum_id`) REFERENCES `museums`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
