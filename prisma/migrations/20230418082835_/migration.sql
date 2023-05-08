-- AlterTable
ALTER TABLE `payments` ADD COLUMN `discount_amount` DECIMAL(10, 2) NULL,
    ADD COLUMN `discount_type` ENUM('money', 'percent') NULL;
