/*
  Warnings:

  - You are about to drop the column `main_photo_path` on the `contents` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[main_content_image_path]` on the table `contents` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `contents_main_photo_path_key` ON `contents`;

-- AlterTable
ALTER TABLE `contents` DROP COLUMN `main_photo_path`,
    ADD COLUMN `main_content_image_path` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `contents_main_content_image_path_key` ON `contents`(`main_content_image_path`);
