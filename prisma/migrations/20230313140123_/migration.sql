-- AlterTable
ALTER TABLE `museum_schedule_payments` ADD COLUMN `employee_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `museum_schedule_payments` ADD CONSTRAINT `museum_schedule_payments_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
