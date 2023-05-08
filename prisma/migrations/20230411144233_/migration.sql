-- DropForeignKey
ALTER TABLE `gallery_details` DROP FOREIGN KEY `gallery_details_gallery_id_fkey`;

-- AddForeignKey
ALTER TABLE `gallery_details` ADD CONSTRAINT `gallery_details_gallery_id_fkey` FOREIGN KEY (`gallery_id`) REFERENCES `galleries`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
