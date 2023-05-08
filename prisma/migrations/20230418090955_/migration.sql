-- AlterTable
ALTER TABLE `payments` ADD COLUMN `discount_total` DECIMAL(10, 2) NULL,
    MODIFY `total_with_discount` DECIMAL(10, 2) NULL;
