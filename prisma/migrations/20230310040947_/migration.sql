/*
  Warnings:

  - A unique constraint covering the columns `[title,museum_gallery_category_id]` on the table `museum_galleries` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `museum_galleries_title_museum_gallery_category_id_key` ON `museum_galleries`(`title`, `museum_gallery_category_id`);
