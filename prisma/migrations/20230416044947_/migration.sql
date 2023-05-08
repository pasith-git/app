-- AlterTable
ALTER TABLE `booking` MODIFY `discount_type` ENUM('money', 'percent') NULL,
    MODIFY `discount_amount` DECIMAL(10, 2) NULL;
