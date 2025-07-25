-- CreateTable
CREATE TABLE "UserUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "videosThisMonth" INTEGER NOT NULL,
    "quota" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserUsage_userId_key" ON "UserUsage"("userId");

-- AddForeignKey
ALTER TABLE "UserUsage" ADD CONSTRAINT "UserUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
