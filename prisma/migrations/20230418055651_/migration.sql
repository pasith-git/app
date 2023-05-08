-- CreateTable
CREATE TABLE `payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `booking_id` INTEGER NOT NULL,
    `user_id` INTEGER NULL,
    `transaction_id` VARCHAR(191) NOT NULL,
    `type` ENUM('bank', 'cash') NOT NULL,
    `net_total` DECIMAL(10, 2) NOT NULL,
    `user_amount` DECIMAL(10, 2) NOT NULL,
    `bank_reference_code` VARCHAR(70) NULL,
    `bank_bill_number` VARCHAR(70) NULL,
    `bank_bill_name` VARCHAR(70) NULL,
    `bank_bill_phone` VARCHAR(70) NULL,
    `bank_pecentage` DECIMAL(10, 2) NULL,
    `bank_pecentage_amount` DECIMAL(10, 2) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `payment_id` INTEGER NOT NULL,
    `booking_code` VARCHAR(191) NOT NULL,
    `is_scanned` BOOLEAN NOT NULL,
    `is_checked_in` BOOLEAN NOT NULL,
    `checked_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_details` ADD CONSTRAINT `payment_details_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
