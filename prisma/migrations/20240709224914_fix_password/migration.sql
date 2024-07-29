/*
  Warnings:

  - You are about to alter the column `password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(45)`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `password` VARCHAR(45) NOT NULL;
