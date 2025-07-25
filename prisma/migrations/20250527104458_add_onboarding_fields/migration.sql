-- AlterTable
ALTER TABLE "User" ADD COLUMN     "plan" TEXT,
ADD COLUMN     "role" TEXT,
ADD COLUMN     "workspaceName" TEXT,
ALTER COLUMN "name" DROP DEFAULT;
