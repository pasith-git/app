/*
  Warnings:

  - You are about to alter the column `phone` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(25)` to `VarChar(15)`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `phone` VARCHAR(15) NOT NULL;

-- AddForeignKey
ALTER TABLE `galleries` ADD CONSTRAINT `galleries_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
