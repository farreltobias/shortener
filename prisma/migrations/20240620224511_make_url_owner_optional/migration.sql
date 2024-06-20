-- DropForeignKey
ALTER TABLE "urls" DROP CONSTRAINT "urls_owner_id_fkey";

-- AlterTable
ALTER TABLE "urls" ALTER COLUMN "owner_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "urls" ADD CONSTRAINT "urls_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
