-- DropForeignKey
ALTER TABLE `payment_museum_schedule_details` DROP FOREIGN KEY `payment_museum_schedule_details_museum_schedule_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment_museum_schedule_details` DROP FOREIGN KEY `payment_museum_schedule_details_payment_museum_schedule_id_fkey`;

-- AddForeignKey
ALTER TABLE `payment_museum_schedule_details` ADD CONSTRAINT `payment_museum_schedule_details_payment_museum_schedule_id_fkey` FOREIGN KEY (`payment_museum_schedule_id`) REFERENCES `payment_museum_schedules`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_museum_schedule_details` ADD CONSTRAINT `payment_museum_schedule_details_museum_schedule_id_fkey` FOREIGN KEY (`museum_schedule_id`) REFERENCES `museum_schedules`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
