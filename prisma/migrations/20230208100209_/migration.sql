/*
  Warnings:

  - You are about to alter the column `last_login` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[email]` on the table `museums` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[logo]` on the table `museums` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[website]` on the table `museums` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `last_login` DATETIME NULL;

-- CreateIndex
CREATE UNIQUE INDEX `museums_email_key` ON `museums`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `museums_logo_key` ON `museums`(`logo`);

-- CreateIndex
CREATE UNIQUE INDEX `museums_website_key` ON `museums`(`website`);
