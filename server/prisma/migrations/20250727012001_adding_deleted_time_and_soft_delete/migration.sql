-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_deleted" BOOLEAN DEFAULT false,
ADD COLUMN     "is_deleted_time" TIMESTAMP(3);
