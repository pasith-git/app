/*
  Warnings:

  - A unique constraint covering the columns `[amount,booking_id,age_group,is_foreigner,museum_id]` on the table `prices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `museum_id` to the `prices` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `prices_amount_booking_id_age_group_is_foreigner_key` ON `prices`;

-- AlterTable
ALTER TABLE `prices` ADD COLUMN `museum_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `prices_amount_booking_id_age_group_is_foreigner_museum_id_key` ON `prices`(`amount`, `booking_id`, `age_group`, `is_foreigner`, `museum_id`);

-- AddForeignKey
ALTER TABLE `prices` ADD CONSTRAINT `prices_museum_id_fkey` FOREIGN KEY (`museum_id`) REFERENCES `museums`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
