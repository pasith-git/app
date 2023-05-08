/*
  Warnings:

  - A unique constraint covering the columns `[code,museum_id]` on the table `Coupon` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Coupon_code_museum_id_key` ON `Coupon`(`code`, `museum_id`);
