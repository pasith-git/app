-- AddForeignKey
ALTER TABLE `booking_schedules` ADD CONSTRAINT `booking_schedules_museum_id_fkey` FOREIGN KEY (`museum_id`) REFERENCES `museums`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
