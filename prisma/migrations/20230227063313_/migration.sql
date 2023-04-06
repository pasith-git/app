-- AlterTable
ALTER TABLE `payment_museum_schedules` ADD COLUMN `bank_percent_amount` DECIMAL(10, 2) NULL,
    ADD COLUMN `bank_percentage` INTEGER NULL,
    ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `info` TEXT NULL,
    ADD COLUMN `payment_bank_bill_name` VARCHAR(191) NULL,
    ADD COLUMN `payment_bank_bill_number` VARCHAR(191) NULL,
    ADD COLUMN `payment_bank_bill_phone` VARCHAR(20) NULL,
    ADD COLUMN `reference_number` VARCHAR(191) NULL;
