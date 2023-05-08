/*
  Warnings:

  - A unique constraint covering the columns `[schedule_time,schedule_date,museum_id]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Booking_schedule_time_schedule_date_museum_id_key` ON `Booking`(`schedule_time`, `schedule_date`, `museum_id`);
