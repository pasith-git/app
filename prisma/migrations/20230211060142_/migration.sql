-- AddForeignKey
ALTER TABLE `payment_bookings` ADD CONSTRAINT `payment_bookings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
