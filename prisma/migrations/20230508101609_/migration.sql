-- AlterTable
ALTER TABLE `bookings` ADD COLUMN `bank_bill_name` VARCHAR(70) NULL,
    ADD COLUMN `bank_bill_number` VARCHAR(70) NULL,
    ADD COLUMN `bank_bill_phone` VARCHAR(70) NULL,
    ADD COLUMN `bank_percentage` DECIMAL(10, 2) NULL,
    ADD COLUMN `bank_percentage_amount` DECIMAL(10, 2) NULL,
    ADD COLUMN `bank_reference_code` VARCHAR(70) NULL;
