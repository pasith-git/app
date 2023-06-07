-- AlterTable
ALTER TABLE `bookings` ADD COLUMN `paid_by_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_paid_by_id_fkey` FOREIGN KEY (`paid_by_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
