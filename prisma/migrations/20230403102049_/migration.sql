/*
  Warnings:

  - You are about to drop the column `payment_method_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `payment_methods` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[payment_wallet_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_payment_method_id_fkey`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `payment_method_id`,
    ADD COLUMN `payment_wallet_id` INTEGER NULL;

-- DropTable
DROP TABLE `payment_methods`;

-- CreateTable
CREATE TABLE `payment_wallets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `card_number` VARCHAR(40) NOT NULL,
    `exp_month` SMALLINT UNSIGNED NOT NULL,
    `exp_year` SMALLINT UNSIGNED NOT NULL,
    `cvc` VARCHAR(5) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_wallets_card_number_key`(`card_number`),
    UNIQUE INDEX `payment_wallets_cvc_key`(`cvc`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_payment_wallet_id_key` ON `users`(`payment_wallet_id`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_payment_wallet_id_fkey` FOREIGN KEY (`payment_wallet_id`) REFERENCES `payment_wallets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
