/*
  Warnings:

  - Made the column `address` on table `museums` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `museums` MODIFY `address` TEXT NOT NULL;
