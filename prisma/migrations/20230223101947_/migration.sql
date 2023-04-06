/*
  Warnings:

  - Made the column `user_id` on table `payment_packages` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `payment_packages` DROP FOREIGN KEY `payment_packages_user_id_fkey`;

-- AlterTable
ALTER TABLE `payment_packages` MODIFY `user_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `payment_packages` ADD CONSTRAINT `payment_packages_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
