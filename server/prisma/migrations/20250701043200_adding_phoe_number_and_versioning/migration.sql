-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;
