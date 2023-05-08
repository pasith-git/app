/*
  Warnings:

  - You are about to drop the column `logo` on the `museums` table. All the data in the column will be lost.
  - You are about to drop the column `museum_id` on the `photos` table. All the data in the column will be lost.
  - You are about to drop the column `image_path` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `is_staff` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_login` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `content_photos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `museum_galleries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `museum_gallery_categories` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[logo_image_path]` on the table `museums` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profile_image_path]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `is_deleted` to the `museums` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vat_pay_type` to the `museums` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vat_percentage` to the `museums` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `museums` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `content_id` to the `photos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_deleted` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `content_photos` DROP FOREIGN KEY `content_photos_content_id_fkey`;

-- DropForeignKey
ALTER TABLE `content_photos` DROP FOREIGN KEY `content_photos_photo_id_fkey`;

-- DropForeignKey
ALTER TABLE `museum_galleries` DROP FOREIGN KEY `museum_galleries_museum_gallery_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `museum_gallery_categories` DROP FOREIGN KEY `museum_gallery_categories_museum_id_fkey`;

-- DropForeignKey
ALTER TABLE `photos` DROP FOREIGN KEY `photos_museum_id_fkey`;

-- DropIndex
DROP INDEX `museums_logo_key` ON `museums`;

-- DropIndex
DROP INDEX `users_image_path_key` ON `users`;

-- AlterTable
ALTER TABLE `contents` MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `museums` DROP COLUMN `logo`,
    ADD COLUMN `close_day_of_week` VARCHAR(191) NULL,
    ADD COLUMN `close_time` TIME NULL,
    ADD COLUMN `is_deleted` BOOLEAN NOT NULL,
    ADD COLUMN `logo_image_path` VARCHAR(191) NULL,
    ADD COLUMN `open_time` TIME NULL,
    ADD COLUMN `vat_auth_code` VARCHAR(191) NULL,
    ADD COLUMN `vat_auth_date` DATETIME(3) NULL,
    ADD COLUMN `vat_pay_type` ENUM('customer', 'museum') NOT NULL,
    ADD COLUMN `vat_percentage` TINYINT NOT NULL,
    MODIFY `phone` VARCHAR(15) NOT NULL;

-- AlterTable
ALTER TABLE `photos` DROP COLUMN `museum_id`,
    ADD COLUMN `content_id` INTEGER NOT NULL,
    ADD COLUMN `title` VARCHAR(70) NULL;

-- AlterTable
ALTER TABLE `roles` ADD COLUMN `display` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `image_path`,
    DROP COLUMN `is_staff`,
    DROP COLUMN `last_login`,
    ADD COLUMN `is_deleted` BOOLEAN NOT NULL,
    ADD COLUMN `last_login_at` DATETIME(3) NULL,
    ADD COLUMN `profile_image_path` VARCHAR(191) NULL,
    MODIFY `username` VARCHAR(50) NOT NULL;

-- DropTable
DROP TABLE `content_photos`;

-- DropTable
DROP TABLE `museum_galleries`;

-- DropTable
DROP TABLE `museum_gallery_categories`;

-- CreateTable
CREATE TABLE `galleries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(70) NOT NULL,
    `description` TEXT NULL,
    `museum_id` INTEGER NOT NULL,
    `author_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gallery_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(70) NULL,
    `gallery_id` INTEGER NOT NULL,
    `image_path` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,

    UNIQUE INDEX `gallery_details_image_path_key`(`image_path`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `museums_logo_image_path_key` ON `museums`(`logo_image_path`);

-- CreateIndex
CREATE UNIQUE INDEX `users_profile_image_path_key` ON `users`(`profile_image_path`);

-- AddForeignKey
ALTER TABLE `galleries` ADD CONSTRAINT `galleries_museum_id_fkey` FOREIGN KEY (`museum_id`) REFERENCES `museums`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gallery_details` ADD CONSTRAINT `gallery_details_gallery_id_fkey` FOREIGN KEY (`gallery_id`) REFERENCES `galleries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `photos` ADD CONSTRAINT `photos_content_id_fkey` FOREIGN KEY (`content_id`) REFERENCES `contents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
