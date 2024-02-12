/*
  Warnings:

  - You are about to drop the column `snackBoxId` on the `Refreshment` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SnackBoxPackageType" AS ENUM ('PAPER_BAG', 'SNACK_BOX_S', 'SNACK_BOX_M');

-- CreateEnum
CREATE TYPE "SnackBoxBeverage" AS ENUM ('INCLUDE', 'EXCLUDE', 'NONE');

-- DropForeignKey
ALTER TABLE "Refreshment" DROP CONSTRAINT "Refreshment_snackBoxId_fkey";

-- AlterTable
ALTER TABLE "Refreshment" DROP COLUMN "snackBoxId";

-- AlterTable
ALTER TABLE "SnackBox" ADD COLUMN     "beverage" "SnackBoxBeverage" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "packageType" "SnackBoxPackageType" NOT NULL DEFAULT 'SNACK_BOX_S';

-- CreateTable
CREATE TABLE "SnackBoxRefreshment" (
    "id" TEXT NOT NULL,
    "refreshmentId" TEXT NOT NULL,
    "snackBoxId" TEXT NOT NULL,

    CONSTRAINT "SnackBoxRefreshment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SnackBoxRefreshment" ADD CONSTRAINT "SnackBoxRefreshment_refreshmentId_fkey" FOREIGN KEY ("refreshmentId") REFERENCES "Refreshment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnackBoxRefreshment" ADD CONSTRAINT "SnackBoxRefreshment_snackBoxId_fkey" FOREIGN KEY ("snackBoxId") REFERENCES "SnackBox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
