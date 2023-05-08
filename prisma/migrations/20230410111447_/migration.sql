/*
  Warnings:

  - You are about to drop the column `description` on the `gallery_details` table. All the data in the column will be lost.
  - You are about to drop the column `image_path` on the `gallery_details` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gallery_image_path]` on the table `gallery_details` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gallery_image_path` to the `gallery_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `gallery_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `schedule_times` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_limit` to the `schedule_times` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `gallery_details_image_path_key` ON `gallery_details`;

-- AlterTable
ALTER TABLE `gallery_details` DROP COLUMN `description`,
    DROP COLUMN `image_path`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `gallery_image_path` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `schedule_times` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    ADD COLUMN `user_limit` INTEGER UNSIGNED NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `gallery_details_gallery_image_path_key` ON `gallery_details`(`gallery_image_path`);
