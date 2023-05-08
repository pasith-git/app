/*
  Warnings:

  - You are about to drop the column `net_total` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `payments` table. All the data in the column will be lost.
  - Added the required column `booked_at` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_foreigner` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_charge` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_pay` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_with_discount` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `way` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payments` DROP COLUMN `net_total`,
    DROP COLUMN `type`,
    ADD COLUMN `booked_at` DATETIME(3) NOT NULL,
    ADD COLUMN `is_foreigner` BOOLEAN NOT NULL,
    ADD COLUMN `paid_at` DATETIME(3) NULL,
    ADD COLUMN `status` ENUM('pending', 'success', 'failure') NOT NULL,
    ADD COLUMN `total` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `total_charge` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `total_pay` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `total_with_discount` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `way` ENUM('booking', 'walking') NOT NULL;
