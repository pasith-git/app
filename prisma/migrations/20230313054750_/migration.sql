-- DropForeignKey
ALTER TABLE `museum_schedule_payments` DROP FOREIGN KEY `museum_schedule_payments_user_id_fkey`;

-- AlterTable
ALTER TABLE `museum_schedule_payments` MODIFY `user_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `museum_schedule_payments` ADD CONSTRAINT `museum_schedule_payments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
