/*
  Warnings:

  - Added the required column `role` to the `invitations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invitations" ADD COLUMN     "message" TEXT,
ADD COLUMN     "role" TEXT NOT NULL;
