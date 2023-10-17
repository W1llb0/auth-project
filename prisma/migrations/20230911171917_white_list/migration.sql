/*
  Warnings:

  - You are about to drop the `JwtBlackList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "JwtBlackList";

-- CreateTable
CREATE TABLE "JwtRefreshTokens" (
    "token" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JwtRefreshTokens_pkey" PRIMARY KEY ("token")
);

-- CreateIndex
CREATE UNIQUE INDEX "JwtRefreshTokens_token_key" ON "JwtRefreshTokens"("token");
