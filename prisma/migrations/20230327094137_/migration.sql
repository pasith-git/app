/*
  Warnings:

  - A unique constraint covering the columns `[payment_method_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `payment_method_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `payment_methods` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `card_number` VARCHAR(40) NOT NULL,
    `exp_month` SMALLINT UNSIGNED NOT NULL,
    `exp_year` SMALLINT UNSIGNED NOT NULL,
    `cvc` VARCHAR(5) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_methods_card_number_key`(`card_number`),
    UNIQUE INDEX `payment_methods_cvc_key`(`cvc`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_payment_method_id_key` ON `users`(`payment_method_id`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_payment_method_id_fkey` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
