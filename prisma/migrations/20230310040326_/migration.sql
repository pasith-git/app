/*
  Warnings:

  - Added the required column `title` to the `museum_galleries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `museum_galleries` ADD COLUMN `title` VARCHAR(70) NOT NULL;
