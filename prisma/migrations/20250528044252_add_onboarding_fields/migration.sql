/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `plan` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- Rename the table to use snake_case
ALTER TABLE "User" RENAME TO "users";

-- First, add the new columns as nullable
ALTER TABLE "users" DROP CONSTRAINT "User_pkey";

-- Add new columns
ALTER TABLE "users" 
ADD COLUMN IF NOT EXISTS "id" TEXT,
ADD COLUMN IF NOT EXISTS "workspace_name" TEXT,
ADD COLUMN IF NOT EXISTS "onboarding_completed" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "plan" SET DEFAULT 'free';

-- Update existing rows with default values
UPDATE "users" SET 
  id = gen_random_uuid()::text,
  onboarding_completed = false,
  created_at = CURRENT_TIMESTAMP,
  updated_at = CURRENT_TIMESTAMP,
  plan = COALESCE(plan, 'free');

-- Now make the columns required
ALTER TABLE "users" 
ALTER COLUMN "id" SET NOT NULL,
ALTER COLUMN "onboarding_completed" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "plan" SET NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- Add unique constraint on email
ALTER TABLE "users" ADD CONSTRAINT "users_email_key" UNIQUE ("email");
