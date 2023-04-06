/*
  Warnings:

  - The primary key for the `museum_galleries` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `museum_id` on the `museum_galleries` table. All the data in the column will be lost.
  - You are about to drop the column `branch_id` on the `museum_gallery_categories` table. All the data in the column will be lost.
  - You are about to drop the `branch_galleries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `branch_gallery_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `branches` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,museum_id]` on the table `museum_gallery_categories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `museum_galleries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_path` to the `museum_galleries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `museum_id` to the `museum_gallery_categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `branch_galleries` DROP FOREIGN KEY `branch_galleries_branch_gallery_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `branch_gallery_categories` DROP FOREIGN KEY `branch_gallery_categories_branch_id_fkey`;

-- DropForeignKey
ALTER TABLE `branches` DROP FOREIGN KEY `branches_country_id_fkey`;

-- DropForeignKey
ALTER TABLE `branches` DROP FOREIGN KEY `branches_district_id_fkey`;

-- DropForeignKey
ALTER TABLE `branches` DROP FOREIGN KEY `branches_museum_id_fkey`;

-- DropForeignKey
ALTER TABLE `museum_galleries` DROP FOREIGN KEY `museum_galleries_museum_id_fkey`;

-- DropForeignKey
ALTER TABLE `museum_gallery_categories` DROP FOREIGN KEY `museum_gallery_categories_branch_id_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_branch_id_fkey`;

-- DropIndex
DROP INDEX `museum_gallery_categories_name_branch_id_key` ON `museum_gallery_categories`;

-- AlterTable
ALTER TABLE `museum_galleries` DROP PRIMARY KEY,
    DROP COLUMN `museum_id`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `image_path` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `museum_gallery_categories` DROP COLUMN `branch_id`,
    ADD COLUMN `museum_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `branch_galleries`;

-- DropTable
DROP TABLE `branch_gallery_categories`;

-- DropTable
DROP TABLE `branches`;

-- CreateIndex
CREATE UNIQUE INDEX `museum_gallery_categories_name_museum_id_key` ON `museum_gallery_categories`(`name`, `museum_id`);

-- AddForeignKey
ALTER TABLE `museum_gallery_categories` ADD CONSTRAINT `museum_gallery_categories_museum_id_fkey` FOREIGN KEY (`museum_id`) REFERENCES `museums`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
