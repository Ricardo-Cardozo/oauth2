/*
  Warnings:

  - You are about to drop the column `userId` on the `Token` table. All the data in the column will be lost.
  - Added the required column `username` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Token_userId_idx` ON `Token`;

-- AlterTable
ALTER TABLE `Token` DROP COLUMN `userId`,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Token_username_idx` ON `Token`(`username`);
