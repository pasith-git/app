-- DropForeignKey
ALTER TABLE `photos` DROP FOREIGN KEY `photos_content_id_fkey`;

-- AddForeignKey
ALTER TABLE `photos` ADD CONSTRAINT `photos_content_id_fkey` FOREIGN KEY (`content_id`) REFERENCES `contents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
