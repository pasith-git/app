/*
  Warnings:

  - You are about to alter the column `last_login` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `restaurants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `branches` DROP FOREIGN KEY `branches_museum_id_fkey`;

-- DropForeignKey
ALTER TABLE `museum_galleries` DROP FOREIGN KEY `museum_galleries_museum_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment_packages` DROP FOREIGN KEY `payment_packages_museum_id_fkey`;

-- DropForeignKey
ALTER TABLE `restaurants` DROP FOREIGN KEY `restaurants_country_id_fkey`;

-- DropForeignKey
ALTER TABLE `restaurants` DROP FOREIGN KEY `restaurants_district_id_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_museum_id_fkey`;

-- AlterTable
ALTER TABLE `users` MODIFY `last_login` DATETIME NULL;

-- DropTable
DROP TABLE `restaurants`;

-- CreateTable
CREATE TABLE `museums` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(70) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(25) NULL,
    `logo` VARCHAR(191) NULL,
    `country_id` INTEGER NOT NULL,
    `district_id` INTEGER NULL,
    `website` VARCHAR(191) NULL,
    `info` TEXT NULL,
    `description` TEXT NULL,

    UNIQUE INDEX `museums_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `museums` ADD CONSTRAINT `museums_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `museums` ADD CONSTRAINT `museums_district_id_fkey` FOREIGN KEY (`district_id`) REFERENCES `districts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `branches` ADD CONSTRAINT `branches_museum_id_fkey` FOREIGN KEY (`museum_id`) REFERENCES `museums`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_museum_id_fkey` FOREIGN KEY (`museum_id`) REFERENCES `museums`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_packages` ADD CONSTRAINT `payment_packages_museum_id_fkey` FOREIGN KEY (`museum_id`) REFERENCES `museums`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `museum_galleries` ADD CONSTRAINT `museum_galleries_museum_id_fkey` FOREIGN KEY (`museum_id`) REFERENCES `museums`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
