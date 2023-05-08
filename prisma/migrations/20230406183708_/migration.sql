/*
  Warnings:

  - You are about to drop the column `country_id` on the `museums` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `museums` table. All the data in the column will be lost.
  - You are about to drop the column `district_id` on the `museums` table. All the data in the column will be lost.
  - You are about to drop the column `info` on the `museums` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `museums` DROP FOREIGN KEY `museums_country_id_fkey`;

-- DropForeignKey
ALTER TABLE `museums` DROP FOREIGN KEY `museums_district_id_fkey`;

-- AlterTable
ALTER TABLE `museums` DROP COLUMN `country_id`,
    DROP COLUMN `description`,
    DROP COLUMN `district_id`,
    DROP COLUMN `info`,
    ADD COLUMN `address` TEXT NULL;
