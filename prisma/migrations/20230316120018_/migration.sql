/*
  Warnings:

  - A unique constraint covering the columns `[title,start_time,end_time,museum_id]` on the table `schedule_times` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `schedule_times_start_time_end_time_museum_id_key` ON `schedule_times`;

-- DropIndex
DROP INDEX `schedule_times_title_key` ON `schedule_times`;

-- CreateIndex
CREATE UNIQUE INDEX `schedule_times_title_start_time_end_time_museum_id_key` ON `schedule_times`(`title`, `start_time`, `end_time`, `museum_id`);
