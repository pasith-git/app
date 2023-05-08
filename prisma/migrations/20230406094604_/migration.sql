/*
  Warnings:

  - You are about to drop the column `district_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `gender_other_info` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `info` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_customer_id` on the `users` table. All the data in the column will be lost.
  - The values [other] on the enum `users_gender` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `payment_wallets` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[stripe_account_id]` on the table `museums` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `museum_schedules` DROP FOREIGN KEY `museum_schedules_schedule_time_id_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_district_id_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_payment_wallet_id_fkey`;

-- DropIndex
DROP INDEX `users_stripe_customer_id_key` ON `users`;

-- AlterTable
ALTER TABLE `museums` ADD COLUMN `stripe_account_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `district_id`,
    DROP COLUMN `gender_other_info`,
    DROP COLUMN `info`,
    DROP COLUMN `stripe_customer_id`,
    MODIFY `gender` ENUM('male', 'female', 'lgbtq') NOT NULL;

-- DropTable
DROP TABLE `payment_wallets`;

-- CreateIndex
CREATE UNIQUE INDEX `museums_stripe_account_id_key` ON `museums`(`stripe_account_id`);

-- AddForeignKey
ALTER TABLE `museum_schedules` ADD CONSTRAINT `museum_schedules_schedule_time_id_fkey` FOREIGN KEY (`schedule_time_id`) REFERENCES `schedule_times`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
