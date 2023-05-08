-- DropForeignKey
ALTER TABLE `gallery_details` DROP FOREIGN KEY `gallery_details_gallery_id_fkey`;

-- DropForeignKey
ALTER TABLE `photos` DROP FOREIGN KEY `photos_content_id_fkey`;

-- AddForeignKey
ALTER TABLE `gallery_details` ADD CONSTRAINT `gallery_details_gallery_id_fkey` FOREIGN KEY (`gallery_id`) REFERENCES `galleries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `photos` ADD CONSTRAINT `photos_content_id_fkey` FOREIGN KEY (`content_id`) REFERENCES `contents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
