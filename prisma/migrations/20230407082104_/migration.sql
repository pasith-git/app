/*
  Warnings:

  - A unique constraint covering the columns `[display]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - Made the column `display` on table `roles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `roles` MODIFY `display` VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `roles_display_key` ON `roles`(`display`);
