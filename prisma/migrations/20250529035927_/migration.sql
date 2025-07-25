/*
  Warnings:

  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceName` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
DROP COLUMN "workspaceName",
ADD COLUMN     "teamId" TEXT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamUsage" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "videosThisMonth" INTEGER NOT NULL,
    "quota" INTEGER NOT NULL,
    "activeUsers" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandKit" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "logo" TEXT,
    "fonts" TEXT[],
    "colors" TEXT[],

    CONSTRAINT "BrandKit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TeamUsage_teamId_key" ON "TeamUsage"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "BrandKit_teamId_key" ON "BrandKit"("teamId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamUsage" ADD CONSTRAINT "TeamUsage_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandKit" ADD CONSTRAINT "BrandKit_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
