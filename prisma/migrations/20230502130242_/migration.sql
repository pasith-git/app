-- DropForeignKey
ALTER TABLE `tickets` DROP FOREIGN KEY `tickets_booking_id_fkey`;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
