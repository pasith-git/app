/*
  Warnings:

  - You are about to drop the column `image_path` on the `countries` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[flag_image_path]` on the table `countries` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `countries_image_path_key` ON `countries`;

-- AlterTable
ALTER TABLE `countries` DROP COLUMN `image_path`,
    ADD COLUMN `flag_image_path` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `museums` MODIFY `vat_auth_date` DATE NULL;

-- CreateIndex
CREATE UNIQUE INDEX `countries_flag_image_path_key` ON `countries`(`flag_image_path`);
