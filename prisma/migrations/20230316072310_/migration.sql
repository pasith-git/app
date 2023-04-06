/*
  Warnings:

  - A unique constraint covering the columns `[start_date,schedule_time_id,museum_id]` on the table `museum_schedules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[start_time,end_time,museum_id]` on the table `schedule_times` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `museum_id` to the `museum_schedule_payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `museum_id` to the `schedule_times` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `museum_schedules_start_date_schedule_time_id_key` ON `museum_schedules`;

-- DropIndex
DROP INDEX `schedule_times_start_time_end_time_key` ON `schedule_times`;

-- AlterTable
ALTER TABLE `museum_schedule_payments` ADD COLUMN `museum_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `schedule_times` ADD COLUMN `museum_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `museum_schedules_start_date_schedule_time_id_museum_id_key` ON `museum_schedules`(`start_date`, `schedule_time_id`, `museum_id`);

-- CreateIndex
CREATE UNIQUE INDEX `schedule_times_start_time_end_time_museum_id_key` ON `schedule_times`(`start_time`, `end_time`, `museum_id`);

-- AddForeignKey
ALTER TABLE `schedule_times` ADD CONSTRAINT `schedule_times_museum_id_fkey` FOREIGN KEY (`museum_id`) REFERENCES `museums`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `museum_schedule_payments` ADD CONSTRAINT `museum_schedule_payments_museum_id_fkey` FOREIGN KEY (`museum_id`) REFERENCES `museums`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
