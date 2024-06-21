/*
  Warnings:

  - A unique constraint covering the columns `[code,deleted_at]` on the table `urls` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "urls_code_key";

-- CreateIndex
CREATE UNIQUE INDEX "urls_code_deleted_at_key" ON "urls"("code", "deleted_at");
