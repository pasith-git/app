/*
  Warnings:

  - Added the required column `museum_id` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `coupon` ADD COLUMN `museum_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Coupon` ADD CONSTRAINT `Coupon_museum_id_fkey` FOREIGN KEY (`museum_id`) REFERENCES `museums`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
