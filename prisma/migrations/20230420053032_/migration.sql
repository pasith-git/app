-- AlterTable
ALTER TABLE `payments` ADD COLUMN `adult_price` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `child_price` DECIMAL(10, 2) NOT NULL DEFAULT 0;
