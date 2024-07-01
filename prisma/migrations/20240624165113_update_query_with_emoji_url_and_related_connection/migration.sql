/*
  Warnings:

  - You are about to drop the column `queryContent` on the `queries` table. All the data in the column will be lost.
  - You are about to drop the column `queryName` on the `queries` table. All the data in the column will be lost.
  - Added the required column `connection_id` to the `queries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `queries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "queries" DROP COLUMN "queryContent",
DROP COLUMN "queryName",
ADD COLUMN     "connection_id" TEXT NOT NULL,
ADD COLUMN     "content" TEXT,
ADD COLUMN     "emojiUrl" TEXT,
ADD COLUMN     "name" VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE "queries" ADD CONSTRAINT "queries_connection_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "connections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
