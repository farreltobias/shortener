-- CreateTable
CREATE TABLE "urls" (
    "id" TEXT NOT NULL,
    "base_url" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "urls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "urls_code_key" ON "urls"("code");
