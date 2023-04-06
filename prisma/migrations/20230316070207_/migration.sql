/*
  Warnings:

  - You are about to drop the column `end_date` on the `museum_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `museum_schedules` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[start_date,schedule_time_id]` on the table `museum_schedules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `schedule_time_id` to the `museum_schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `museum_schedules` DROP COLUMN `end_date`,
    DROP COLUMN `title`,
    ADD COLUMN `domestic_price` DECIMAL(10, 2) NULL,
    ADD COLUMN `schedule_time_id` INTEGER NOT NULL,
    MODIFY `start_date` DATE NOT NULL;

-- CreateTable
CREATE TABLE `schedule_times` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` CHAR(70) NOT NULL,
    `start_time` TIME NOT NULL,
    `end_time` TIME NOT NULL,

    UNIQUE INDEX `schedule_times_title_key`(`title`),
    UNIQUE INDEX `schedule_times_start_time_end_time_key`(`start_time`, `end_time`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `museum_schedules_start_date_schedule_time_id_key` ON `museum_schedules`(`start_date`, `schedule_time_id`);

-- AddForeignKey
ALTER TABLE `museum_schedules` ADD CONSTRAINT `museum_schedules_schedule_time_id_fkey` FOREIGN KEY (`schedule_time_id`) REFERENCES `schedule_times`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
