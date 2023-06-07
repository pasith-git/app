/*
  Warnings:

  - You are about to drop the column `bank_bill_description` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `bank_bill_name` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `bank_bill_number` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `bank_bill_phone` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `bank_percentage` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `bank_percentage_amount` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `bank_reference_code` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `adult_total` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `booked_at` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `child_total` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `confirmed_image_path` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `discount_amount` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `discount_total` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `discount_type` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `is_foreigner` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `number_of_adult` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `number_of_child` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `paid_at` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `total_charge` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `total_pay` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `total_with_discount` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `way` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the `payment_details` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[invoice_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invoice_id` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `payment_details` DROP FOREIGN KEY `payment_details_payment_id_fkey`;

-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `payments_user_id_fkey`;

-- DropIndex
DROP INDEX `payments_confirmed_image_path_key` ON `payments`;

-- AlterTable
ALTER TABLE `bookings` DROP COLUMN `bank_bill_description`,
    DROP COLUMN `bank_bill_name`,
    DROP COLUMN `bank_bill_number`,
    DROP COLUMN `bank_bill_phone`,
    DROP COLUMN `bank_percentage`,
    DROP COLUMN `bank_percentage_amount`,
    DROP COLUMN `bank_reference_code`;

-- AlterTable
ALTER TABLE `payments` DROP COLUMN `adult_total`,
    DROP COLUMN `booked_at`,
    DROP COLUMN `child_total`,
    DROP COLUMN `confirmed_image_path`,
    DROP COLUMN `discount_amount`,
    DROP COLUMN `discount_total`,
    DROP COLUMN `discount_type`,
    DROP COLUMN `is_foreigner`,
    DROP COLUMN `number_of_adult`,
    DROP COLUMN `number_of_child`,
    DROP COLUMN `paid_at`,
    DROP COLUMN `status`,
    DROP COLUMN `total_charge`,
    DROP COLUMN `total_pay`,
    DROP COLUMN `total_with_discount`,
    DROP COLUMN `type`,
    DROP COLUMN `user_id`,
    DROP COLUMN `way`,
    ADD COLUMN `invoice_id` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `payment_details`;

-- CreateIndex
CREATE UNIQUE INDEX `payments_invoice_id_key` ON `payments`(`invoice_id`);
