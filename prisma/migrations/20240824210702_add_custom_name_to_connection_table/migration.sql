-- AlterTable
ALTER TABLE "connections" ADD COLUMN     "customName" TEXT;

-- CreateIndex
CREATE INDEX "connections_id_idx" ON "connections"("id");
