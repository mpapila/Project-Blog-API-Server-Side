-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(45) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(45) NOT NULL,
    `isAuthor` BOOLEAN NOT NULL,
    `date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `username_UNIQUE`(`username`),
    UNIQUE INDEX `email_UNIQUE`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
