/*
  Warnings:

  - You are about to drop the column `isForeigner` on the `prices` table. All the data in the column will be lost.
  - Added the required column `is_foreigner` to the `prices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `prices` DROP COLUMN `isForeigner`,
    ADD COLUMN `is_foreigner` BOOLEAN NOT NULL;
