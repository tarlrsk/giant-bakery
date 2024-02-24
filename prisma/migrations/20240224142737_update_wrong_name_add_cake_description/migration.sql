/*
  Warnings:

  - You are about to drop the column `imageFilename` on the `SnackBox` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `SnackBox` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SnackBoxRefreshment" DROP CONSTRAINT "SnackBoxRefreshment_refreshmentId_fkey";

-- DropForeignKey
ALTER TABLE "SnackBoxRefreshment" DROP CONSTRAINT "SnackBoxRefreshment_snackBoxId_fkey";

-- AlterTable
ALTER TABLE "Cake" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "OrderCustomerCake" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "SnackBox" DROP COLUMN "imageFilename",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "imageFileName" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "SnackBoxRefreshment" ADD CONSTRAINT "SnackBoxRefreshment_refreshmentId_fkey" FOREIGN KEY ("refreshmentId") REFERENCES "Refreshment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnackBoxRefreshment" ADD CONSTRAINT "SnackBoxRefreshment_snackBoxId_fkey" FOREIGN KEY ("snackBoxId") REFERENCES "SnackBox"("id") ON DELETE CASCADE ON UPDATE CASCADE;
