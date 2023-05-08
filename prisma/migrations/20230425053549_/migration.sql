/*
  Warnings:

  - You are about to drop the column `age_group` on the `prices` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[is_foreigner,museum_id]` on the table `prices` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title,museum_id]` on the table `prices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adult_price` to the `prices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `child_price` to the `prices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `prices` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `prices_age_group_is_foreigner_museum_id_key` ON `prices`;

-- AlterTable
ALTER TABLE `prices` DROP COLUMN `age_group`,
    ADD COLUMN `adult_price` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `child_price` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `title` VARCHAR(70) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `prices_is_foreigner_museum_id_key` ON `prices`(`is_foreigner`, `museum_id`);

-- CreateIndex
CREATE UNIQUE INDEX `prices_title_museum_id_key` ON `prices`(`title`, `museum_id`);
