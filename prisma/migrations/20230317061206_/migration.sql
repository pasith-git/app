/*
  Warnings:

  - A unique constraint covering the columns `[title,start_date,schedule_time_id,museum_id]` on the table `museum_schedules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `museum_schedules` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `museum_schedules_start_date_schedule_time_id_museum_id_key` ON `museum_schedules`;

-- AlterTable
ALTER TABLE `museum_schedules` ADD COLUMN `title` CHAR(70) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `museum_schedules_title_start_date_schedule_time_id_museum_id_key` ON `museum_schedules`(`title`, `start_date`, `schedule_time_id`, `museum_id`);
