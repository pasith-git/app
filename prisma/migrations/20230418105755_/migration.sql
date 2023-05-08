/*
  Warnings:

  - The values [walking] on the enum `payments_way` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `payments` MODIFY `way` ENUM('booking', 'walkin') NOT NULL;
