-- CreateTable
CREATE TABLE "invitations" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accepted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invitations_token_key" ON "invitations"("token");

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
