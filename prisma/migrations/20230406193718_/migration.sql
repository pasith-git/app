-- AlterTable
ALTER TABLE `museums` ADD COLUMN `latitude` DECIMAL(8, 6) NULL,
    ADD COLUMN `longitude` DECIMAL(9, 6) NULL;

-- CreateTable
CREATE TABLE `contents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(70) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `museum_id` INTEGER NOT NULL,
    `author_id` INTEGER NOT NULL,
    `main_photo_path` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `contents_main_photo_path_key`(`main_photo_path`),
    UNIQUE INDEX `contents_title_museum_id_key`(`title`, `museum_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `photos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `museum_id` INTEGER NOT NULL,
    `path` VARCHAR(191) NULL,

    UNIQUE INDEX `photos_path_key`(`path`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `content_photos` (
    `content_id` INTEGER NOT NULL,
    `photo_id` INTEGER NOT NULL,

    PRIMARY KEY (`content_id`, `photo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `contents` ADD CONSTRAINT `contents_museum_id_fkey` FOREIGN KEY (`museum_id`) REFERENCES `museums`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contents` ADD CONSTRAINT `contents_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `photos` ADD CONSTRAINT `photos_museum_id_fkey` FOREIGN KEY (`museum_id`) REFERENCES `museums`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `content_photos` ADD CONSTRAINT `content_photos_content_id_fkey` FOREIGN KEY (`content_id`) REFERENCES `contents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `content_photos` ADD CONSTRAINT `content_photos_photo_id_fkey` FOREIGN KEY (`photo_id`) REFERENCES `photos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
