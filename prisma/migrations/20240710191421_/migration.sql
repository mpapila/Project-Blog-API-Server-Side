/*
  Warnings:

  - Added the required column `content` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPublished` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `posts` ADD COLUMN `content` TEXT NOT NULL,
    ADD COLUMN `date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `isPublished` BOOLEAN NOT NULL,
    ADD COLUMN `title` VARCHAR(255) NOT NULL;
