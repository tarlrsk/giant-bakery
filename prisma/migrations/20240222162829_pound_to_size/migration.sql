/*
  Warnings:

  - You are about to drop the column `poundId` on the `CustomerCake` table. All the data in the column will be lost.
  - You are about to drop the column `pound` on the `OrderCustomerCake` table. All the data in the column will be lost.
  - You are about to drop the `MasterCakePound` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CakeToMasterCakePound` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CustomerCake" DROP CONSTRAINT "CustomerCake_poundId_fkey";

-- DropForeignKey
ALTER TABLE "_CakeToMasterCakePound" DROP CONSTRAINT "_CakeToMasterCakePound_A_fkey";

-- DropForeignKey
ALTER TABLE "_CakeToMasterCakePound" DROP CONSTRAINT "_CakeToMasterCakePound_B_fkey";

-- AlterTable
ALTER TABLE "CustomerCake" DROP COLUMN "poundId",
ADD COLUMN     "sizeId" TEXT;

-- AlterTable
ALTER TABLE "OrderCustomerCake" DROP COLUMN "pound",
ADD COLUMN     "size" TEXT;

-- DropTable
DROP TABLE "MasterCakePound";

-- DropTable
DROP TABLE "_CakeToMasterCakePound";

-- CreateTable
CREATE TABLE "MasterCakeSize" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MasterCakeSize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CakeToMasterCakeSize" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CakeToMasterCakeSize_AB_unique" ON "_CakeToMasterCakeSize"("A", "B");

-- CreateIndex
CREATE INDEX "_CakeToMasterCakeSize_B_index" ON "_CakeToMasterCakeSize"("B");

-- AddForeignKey
ALTER TABLE "CustomerCake" ADD CONSTRAINT "CustomerCake_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "MasterCakeSize"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CakeToMasterCakeSize" ADD CONSTRAINT "_CakeToMasterCakeSize_A_fkey" FOREIGN KEY ("A") REFERENCES "Cake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CakeToMasterCakeSize" ADD CONSTRAINT "_CakeToMasterCakeSize_B_fkey" FOREIGN KEY ("B") REFERENCES "MasterCakeSize"("id") ON DELETE CASCADE ON UPDATE CASCADE;
