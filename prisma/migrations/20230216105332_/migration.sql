-- AlterTable
ALTER TABLE `payment_packages` ADD COLUMN `bank_percent_amount` DECIMAL(10, 2) NULL,
    ADD COLUMN `bank_percent_tag` INTEGER NULL;
