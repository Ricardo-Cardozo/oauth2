-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `type` ENUM('admin', 'develop') NOT NULL,
    `status` ENUM('ativo', 'inativo') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `idUserCreated` INTEGER NOT NULL,
    `idUserUpdated` INTEGER NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Translate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `keyword` VARCHAR(191) NOT NULL,
    `ptbr` VARCHAR(255) NOT NULL,
    `enus` VARCHAR(255) NOT NULL,
    `esch` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `idUserCreated` INTEGER NOT NULL,
    `idUserUpdated` INTEGER NOT NULL,

    UNIQUE INDEX `Translate_keyword_key`(`keyword`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Token` (
    `accessToken` VARCHAR(191) NOT NULL,
    `accessTokenExpires` DATETIME(3) NOT NULL,
    `refreshToken` VARCHAR(191) NOT NULL,
    `refreshTokenExpires` DATETIME(3) NOT NULL,
    `clientName` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `scope` VARCHAR(191) NOT NULL,
    `revoked` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Token_accessToken_key`(`accessToken`),
    UNIQUE INDEX `Token_refreshToken_key`(`refreshToken`),
    INDEX `Token_clientName_idx`(`clientName`),
    INDEX `Token_userId_idx`(`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `secret` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Client_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
