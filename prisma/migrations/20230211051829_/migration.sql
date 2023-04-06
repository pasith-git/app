-- DropIndex
DROP INDEX `users_branch_id_fkey` ON `users`;

-- CreateTable
CREATE TABLE `booking_schedules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `description` TEXT NULL,
    `current_users` INTEGER NOT NULL,
    `user_limit` INTEGER NOT NULL,
    `museum_id` INTEGER NOT NULL,
    `discount` DECIMAL(10, 2) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_bookings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `transaction_id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('pending', 'success', 'failure') NOT NULL,
    `payment_type` ENUM('credit', 'cash') NOT NULL,
    `payment_date` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_booking_details` (
    `payment_booking_id` INTEGER NOT NULL,
    `booking_schedule_id` INTEGER NOT NULL,

    PRIMARY KEY (`payment_booking_id`, `booking_schedule_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `payment_booking_details` ADD CONSTRAINT `payment_booking_details_payment_booking_id_fkey` FOREIGN KEY (`payment_booking_id`) REFERENCES `payment_bookings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_booking_details` ADD CONSTRAINT `payment_booking_details_booking_schedule_id_fkey` FOREIGN KEY (`booking_schedule_id`) REFERENCES `booking_schedules`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
