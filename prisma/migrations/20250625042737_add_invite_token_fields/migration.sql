-- AlterTable
ALTER TABLE "users" ADD COLUMN     "invite_token" TEXT,
ADD COLUMN     "invite_token_expiry" TIMESTAMP(3);
