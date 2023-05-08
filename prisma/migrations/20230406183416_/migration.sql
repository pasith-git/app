/*
  Warnings:

  - You are about to drop the column `stripe_account_id` on the `museums` table. All the data in the column will be lost.
  - You are about to drop the column `payment_wallet_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `museums` DROP FOREIGN KEY `museums_country_id_fkey`;

-- DropIndex
DROP INDEX `museums_stripe_account_id_key` ON `museums`;

-- DropIndex
DROP INDEX `users_payment_wallet_id_key` ON `users`;

-- AlterTable
ALTER TABLE `museums` DROP COLUMN `stripe_account_id`,
    MODIFY `country_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `payment_wallet_id`;

-- AddForeignKey
ALTER TABLE `museums` ADD CONSTRAINT `museums_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
