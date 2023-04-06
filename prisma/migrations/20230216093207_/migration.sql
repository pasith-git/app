/*
  Warnings:

  - The values [credit] on the enum `payment_packages_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `amount` on the `payment_packages` table. All the data in the column will be lost.
  - Added the required column `total` to the `payment_packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `payment_packages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment_museum_schedules` MODIFY `payment_type` ENUM('bank', 'cash') NOT NULL;

-- AlterTable
ALTER TABLE `payment_packages` DROP COLUMN `amount`,
    ADD COLUMN `bank_name` VARCHAR(191) NULL,
    ADD COLUMN `payment_date` DATETIME(3) NULL,
    ADD COLUMN `payment_name` VARCHAR(191) NULL,
    ADD COLUMN `payment_phone` VARCHAR(191) NULL,
    ADD COLUMN `reference_number` VARCHAR(191) NULL,
    ADD COLUMN `total` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `type` ENUM('bank', 'cash') NOT NULL;
