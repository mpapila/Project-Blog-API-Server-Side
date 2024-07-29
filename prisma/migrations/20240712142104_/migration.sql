-- CreateTable
CREATE TABLE `comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `userId` INTEGER NOT NULL,
    `postId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
