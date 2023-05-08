-- CreateTable
CREATE TABLE `banks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(70) NOT NULL,
    `qrcode_image_path` VARCHAR(191) NOT NULL,
    `museum_id` INTEGER NOT NULL,

    UNIQUE INDEX `banks_qrcode_image_path_key`(`qrcode_image_path`),
    UNIQUE INDEX `banks_name_museum_id_key`(`name`, `museum_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `banks` ADD CONSTRAINT `banks_museum_id_fkey` FOREIGN KEY (`museum_id`) REFERENCES `museums`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
