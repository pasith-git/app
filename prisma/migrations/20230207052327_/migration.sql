-- CreateTable
CREATE TABLE `countries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(70) NOT NULL,
    `image_path` VARCHAR(191) NULL,
    `num_code` VARCHAR(20) NULL,
    `locale` VARCHAR(10) NOT NULL,

    UNIQUE INDEX `countries_name_key`(`name`),
    UNIQUE INDEX `countries_image_path_key`(`image_path`),
    UNIQUE INDEX `countries_locale_key`(`locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `provinces` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(70) NOT NULL,

    UNIQUE INDEX `provinces_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `districts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(70) NOT NULL,
    `province_id` INTEGER NOT NULL,

    UNIQUE INDEX `districts_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `restaurants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(70) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(25) NULL,
    `logo` VARCHAR(191) NULL,
    `country_id` INTEGER NOT NULL,
    `district_id` INTEGER NULL,
    `website` VARCHAR(191) NULL,
    `info` TEXT NULL,
    `description` TEXT NULL,

    UNIQUE INDEX `restaurants_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `branches` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(70) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(25) NULL,
    `website` VARCHAR(191) NULL,
    `image_path` VARCHAR(191) NULL,
    `info` TEXT NULL,
    `longtitude` DECIMAL(9, 6) NULL,
    `latitude` DECIMAL(8, 6) NULL,
    `museum_id` INTEGER NOT NULL,
    `country_id` INTEGER NOT NULL,
    `district_id` INTEGER NULL,
    `village` VARCHAR(70) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `branches_phone_key`(`phone`),
    UNIQUE INDEX `branches_name_museum_id_key`(`name`, `museum_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(40) NOT NULL,
    `first_name` VARCHAR(70) NOT NULL,
    `last_name` VARCHAR(70) NOT NULL,
    `gender` ENUM('male', 'female', 'other') NOT NULL,
    `gender_other_info` TEXT NULL,
    `birth_date` DATE NOT NULL,
    `phone` VARCHAR(25) NOT NULL,
    `is_staff` BOOLEAN NOT NULL,
    `is_active` BOOLEAN NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `branch_id` INTEGER NULL,
    `museum_id` INTEGER NULL,
    `country_id` INTEGER NOT NULL,
    `district_id` INTEGER NULL,
    `village` VARCHAR(70) NOT NULL,
    `info` TEXT NULL,
    `image_path` VARCHAR(191) NULL,
    `last_login` DATETIME NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_phone_key`(`phone`),
    UNIQUE INDEX `users_password_key`(`password`),
    UNIQUE INDEX `users_image_path_key`(`image_path`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(40) NOT NULL,

    UNIQUE INDEX `roles_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_roles` (
    `user_id` INTEGER NOT NULL,
    `role_id` INTEGER NOT NULL,

    PRIMARY KEY (`user_id`, `role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `packages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(70) NOT NULL,
    `description` TEXT NULL,
    `duration` INTEGER NOT NULL,
    `user_limit` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `discount` DECIMAL(10, 2) NULL,

    UNIQUE INDEX `packages_name_duration_user_limit_price_key`(`name`, `duration`, `user_limit`, `price`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_packages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `museum_id` INTEGER NOT NULL,
    `user_id` INTEGER NULL,
    `package_id` INTEGER NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `package_start_date` DATETIME(3) NOT NULL,
    `package_end_date` DATETIME(3) NOT NULL,
    `status` ENUM('pending', 'success', 'failure') NOT NULL,
    `image_path` VARCHAR(191) NULL,
    `info` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `museum_gallery_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(70) NOT NULL,
    `branch_id` INTEGER NOT NULL,

    UNIQUE INDEX `museum_gallery_categories_name_branch_id_key`(`name`, `branch_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `museum_galleries` (
    `museum_id` INTEGER NOT NULL,
    `museum_gallery_category_id` INTEGER NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`museum_id`, `museum_gallery_category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `branch_gallery_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(70) NOT NULL,
    `branch_id` INTEGER NOT NULL,

    UNIQUE INDEX `branch_gallery_categories_name_branch_id_key`(`name`, `branch_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `branch_galleries` (
    `branch_gallery_category_id` INTEGER NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`branch_gallery_category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `districts` ADD CONSTRAINT `districts_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `provinces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `restaurants` ADD CONSTRAINT `restaurants_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `restaurants` ADD CONSTRAINT `restaurants_district_id_fkey` FOREIGN KEY (`district_id`) REFERENCES `districts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `branches` ADD CONSTRAINT `branches_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `branches` ADD CONSTRAINT `branches_district_id_fkey` FOREIGN KEY (`district_id`) REFERENCES `districts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `branches` ADD CONSTRAINT `branches_museum_id_fkey` FOREIGN KEY (`museum_id`) REFERENCES `restaurants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_district_id_fkey` FOREIGN KEY (`district_id`) REFERENCES `districts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_museum_id_fkey` FOREIGN KEY (`museum_id`) REFERENCES `restaurants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_packages` ADD CONSTRAINT `payment_packages_museum_id_fkey` FOREIGN KEY (`museum_id`) REFERENCES `restaurants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_packages` ADD CONSTRAINT `payment_packages_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_packages` ADD CONSTRAINT `payment_packages_package_id_fkey` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `museum_gallery_categories` ADD CONSTRAINT `museum_gallery_categories_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `museum_galleries` ADD CONSTRAINT `museum_galleries_museum_id_fkey` FOREIGN KEY (`museum_id`) REFERENCES `restaurants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `museum_galleries` ADD CONSTRAINT `museum_galleries_museum_gallery_category_id_fkey` FOREIGN KEY (`museum_gallery_category_id`) REFERENCES `museum_gallery_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `branch_gallery_categories` ADD CONSTRAINT `branch_gallery_categories_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `branch_galleries` ADD CONSTRAINT `branch_galleries_branch_gallery_category_id_fkey` FOREIGN KEY (`branch_gallery_category_id`) REFERENCES `branch_gallery_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
