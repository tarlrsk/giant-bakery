/*
  Warnings:

  - You are about to drop the column `unitTypeId` on the `Cake` table. All the data in the column will be lost.
  - You are about to drop the column `customCakeId` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `presetCakesId` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the `CustomCake` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderCustomCake` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderPresetCake` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Variant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CakeToVariant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CustomCakeToVariant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OrderCustomCakeToVariant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OrderPresetCakeToVariant` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[customerCakeId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `OrderSnackBox` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `OrderSnackBox` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `OrderSnackBox` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cake" DROP CONSTRAINT "Cake_unitTypeId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_customCakeId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_presetCakesId_fkey";

-- DropForeignKey
ALTER TABLE "CustomCake" DROP CONSTRAINT "CustomCake_cakeId_fkey";

-- DropForeignKey
ALTER TABLE "OrderCustomCake" DROP CONSTRAINT "OrderCustomCake_customCakeId_fkey";

-- DropForeignKey
ALTER TABLE "OrderCustomCake" DROP CONSTRAINT "OrderCustomCake_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderCustomCake" DROP CONSTRAINT "OrderCustomCake_unitTypeId_fkey";

-- DropForeignKey
ALTER TABLE "OrderPresetCake" DROP CONSTRAINT "OrderPresetCake_cakeId_fkey";

-- DropForeignKey
ALTER TABLE "OrderPresetCake" DROP CONSTRAINT "OrderPresetCake_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderPresetCake" DROP CONSTRAINT "OrderPresetCake_unitTypeId_fkey";

-- DropForeignKey
ALTER TABLE "_CakeToVariant" DROP CONSTRAINT "_CakeToVariant_A_fkey";

-- DropForeignKey
ALTER TABLE "_CakeToVariant" DROP CONSTRAINT "_CakeToVariant_B_fkey";

-- DropForeignKey
ALTER TABLE "_CustomCakeToVariant" DROP CONSTRAINT "_CustomCakeToVariant_A_fkey";

-- DropForeignKey
ALTER TABLE "_CustomCakeToVariant" DROP CONSTRAINT "_CustomCakeToVariant_B_fkey";

-- DropForeignKey
ALTER TABLE "_OrderCustomCakeToVariant" DROP CONSTRAINT "_OrderCustomCakeToVariant_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderCustomCakeToVariant" DROP CONSTRAINT "_OrderCustomCakeToVariant_B_fkey";

-- DropForeignKey
ALTER TABLE "_OrderPresetCakeToVariant" DROP CONSTRAINT "_OrderPresetCakeToVariant_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderPresetCakeToVariant" DROP CONSTRAINT "_OrderPresetCakeToVariant_B_fkey";

-- DropIndex
DROP INDEX "CartItem_customCakeId_key";

-- AlterTable
ALTER TABLE "Cake" DROP COLUMN "unitTypeId";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "customCakeId",
DROP COLUMN "presetCakesId",
ADD COLUMN     "customerCakeId" TEXT,
ADD COLUMN     "orderCustomerCakeId" TEXT;

-- AlterTable
ALTER TABLE "OrderSnackBox" ADD COLUMN     "image" TEXT,
ADD COLUMN     "imageFileName" TEXT,
ADD COLUMN     "imagePath" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "type" "SnackBoxType" NOT NULL;

-- DropTable
DROP TABLE "CustomCake";

-- DropTable
DROP TABLE "OrderCustomCake";

-- DropTable
DROP TABLE "OrderPresetCake";

-- DropTable
DROP TABLE "Variant";

-- DropTable
DROP TABLE "_CakeToVariant";

-- DropTable
DROP TABLE "_CustomCakeToVariant";

-- DropTable
DROP TABLE "_OrderCustomCakeToVariant";

-- DropTable
DROP TABLE "_OrderPresetCakeToVariant";

-- DropEnum
DROP TYPE "VariantType";

-- CreateTable
CREATE TABLE "MasterCakePound" (
    "id" TEXT NOT NULL,
    "name_th" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MasterCakePound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterCakeBase" (
    "id" TEXT NOT NULL,
    "name_th" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MasterCakeBase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterCakeFilling" (
    "id" TEXT NOT NULL,
    "name_th" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MasterCakeFilling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterCakeCream" (
    "id" TEXT NOT NULL,
    "name_th" TEXT NOT NULL,
    "imageFileName" TEXT,
    "imagePath" TEXT,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MasterCakeCream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterCakeTopEdge" (
    "id" TEXT NOT NULL,
    "name_th" TEXT NOT NULL,
    "imageFileName" TEXT,
    "imagePath" TEXT,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MasterCakeTopEdge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterCakeBottomEdge" (
    "id" TEXT NOT NULL,
    "name_th" TEXT NOT NULL,
    "imageFileName" TEXT,
    "imagePath" TEXT,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MasterCakeBottomEdge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterCakeDecoration" (
    "id" TEXT NOT NULL,
    "name_th" TEXT NOT NULL,
    "imageFileName" TEXT,
    "imagePath" TEXT,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MasterCakeDecoration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterCakeSurface" (
    "id" TEXT NOT NULL,
    "name_th" TEXT NOT NULL,
    "imageFileName" TEXT,
    "imagePath" TEXT,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MasterCakeSurface_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerCake" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cakeId" TEXT NOT NULL,
    "poundId" TEXT,
    "baseId" TEXT,
    "fillingId" TEXT,
    "creamId" TEXT,
    "creamColor" TEXT,
    "topEdgeId" TEXT,
    "topEdgeColor" TEXT,
    "bottomEdgeId" TEXT,
    "bottomEdgeColor" TEXT,
    "decorationId" TEXT,
    "surfaceId" TEXT,
    "orderCustomerCakeId" TEXT,

    CONSTRAINT "CustomerCake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderCustomerCake" (
    "id" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "remark" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "imageFileName" TEXT,
    "imagePath" TEXT,
    "image" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "orderId" TEXT NOT NULL,
    "cakeId" TEXT NOT NULL,
    "cakeType" "CakeType" NOT NULL,
    "customerCakeId" TEXT NOT NULL,
    "unitType" TEXT NOT NULL,
    "pound" TEXT,
    "base" TEXT,
    "filling" TEXT,
    "cream" TEXT,
    "creamColor" TEXT,
    "topEdge" TEXT,
    "topEdgeColor" TEXT,
    "bottomEdge" TEXT,
    "bottomEdgeColor" TEXT,
    "decoration" TEXT,
    "surface" TEXT,
    "orderCustomerCake" TEXT,

    CONSTRAINT "OrderCustomerCake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CakeToMasterCakePound" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CakeToMasterCakeBase" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CakeToMasterCakeFilling" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CakeToMasterCakeCream" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CakeToMasterCakeTopEdge" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CakeToMasterCakeBottomEdge" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CakeToMasterCakeDecoration" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CakeToMasterCakeSurface" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CakeToMasterCakePound_AB_unique" ON "_CakeToMasterCakePound"("A", "B");

-- CreateIndex
CREATE INDEX "_CakeToMasterCakePound_B_index" ON "_CakeToMasterCakePound"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CakeToMasterCakeBase_AB_unique" ON "_CakeToMasterCakeBase"("A", "B");

-- CreateIndex
CREATE INDEX "_CakeToMasterCakeBase_B_index" ON "_CakeToMasterCakeBase"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CakeToMasterCakeFilling_AB_unique" ON "_CakeToMasterCakeFilling"("A", "B");

-- CreateIndex
CREATE INDEX "_CakeToMasterCakeFilling_B_index" ON "_CakeToMasterCakeFilling"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CakeToMasterCakeCream_AB_unique" ON "_CakeToMasterCakeCream"("A", "B");

-- CreateIndex
CREATE INDEX "_CakeToMasterCakeCream_B_index" ON "_CakeToMasterCakeCream"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CakeToMasterCakeTopEdge_AB_unique" ON "_CakeToMasterCakeTopEdge"("A", "B");

-- CreateIndex
CREATE INDEX "_CakeToMasterCakeTopEdge_B_index" ON "_CakeToMasterCakeTopEdge"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CakeToMasterCakeBottomEdge_AB_unique" ON "_CakeToMasterCakeBottomEdge"("A", "B");

-- CreateIndex
CREATE INDEX "_CakeToMasterCakeBottomEdge_B_index" ON "_CakeToMasterCakeBottomEdge"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CakeToMasterCakeDecoration_AB_unique" ON "_CakeToMasterCakeDecoration"("A", "B");

-- CreateIndex
CREATE INDEX "_CakeToMasterCakeDecoration_B_index" ON "_CakeToMasterCakeDecoration"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CakeToMasterCakeSurface_AB_unique" ON "_CakeToMasterCakeSurface"("A", "B");

-- CreateIndex
CREATE INDEX "_CakeToMasterCakeSurface_B_index" ON "_CakeToMasterCakeSurface"("B");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_customerCakeId_key" ON "CartItem"("customerCakeId");

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_customerCakeId_fkey" FOREIGN KEY ("customerCakeId") REFERENCES "CustomerCake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_orderCustomerCakeId_fkey" FOREIGN KEY ("orderCustomerCakeId") REFERENCES "OrderCustomerCake"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerCake" ADD CONSTRAINT "CustomerCake_cakeId_fkey" FOREIGN KEY ("cakeId") REFERENCES "Cake"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerCake" ADD CONSTRAINT "CustomerCake_poundId_fkey" FOREIGN KEY ("poundId") REFERENCES "MasterCakePound"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerCake" ADD CONSTRAINT "CustomerCake_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES "MasterCakeBase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerCake" ADD CONSTRAINT "CustomerCake_fillingId_fkey" FOREIGN KEY ("fillingId") REFERENCES "MasterCakeFilling"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerCake" ADD CONSTRAINT "CustomerCake_creamId_fkey" FOREIGN KEY ("creamId") REFERENCES "MasterCakeCream"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerCake" ADD CONSTRAINT "CustomerCake_topEdgeId_fkey" FOREIGN KEY ("topEdgeId") REFERENCES "MasterCakeTopEdge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerCake" ADD CONSTRAINT "CustomerCake_bottomEdgeId_fkey" FOREIGN KEY ("bottomEdgeId") REFERENCES "MasterCakeBottomEdge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerCake" ADD CONSTRAINT "CustomerCake_decorationId_fkey" FOREIGN KEY ("decorationId") REFERENCES "MasterCakeDecoration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerCake" ADD CONSTRAINT "CustomerCake_surfaceId_fkey" FOREIGN KEY ("surfaceId") REFERENCES "MasterCakeSurface"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderCustomerCake" ADD CONSTRAINT "OrderCustomerCake_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderCustomerCake" ADD CONSTRAINT "OrderCustomerCake_cakeId_fkey" FOREIGN KEY ("cakeId") REFERENCES "Cake"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderCustomerCake" ADD CONSTRAINT "OrderCustomerCake_customerCakeId_fkey" FOREIGN KEY ("customerCakeId") REFERENCES "CustomerCake"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderSnackBox" ADD CONSTRAINT "OrderSnackBox_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CakeToMasterCakePound" ADD CONSTRAINT "_CakeToMasterCakePound_A_fkey" FOREIGN KEY ("A") REFERENCES "Cake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CakeToMasterCakePound" ADD CONSTRAINT "_CakeToMasterCakePound_B_fkey" FOREIGN KEY ("B") REFERENCES "MasterCakePound"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CakeToMasterCakeBase" ADD CONSTRAINT "_CakeToMasterCakeBase_A_fkey" FOREIGN KEY ("A") REFERENCES "Cake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CakeToMasterCakeBase" ADD CONSTRAINT "_CakeToMasterCakeBase_B_fkey" FOREIGN KEY ("B") REFERENCES "MasterCakeBase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CakeToMasterCakeFilling" ADD CONSTRAINT "_CakeToMasterCakeFilling_A_fkey" FOREIGN KEY ("A") REFERENCES "Cake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CakeToMasterCakeFilling" ADD CONSTRAINT "_CakeToMasterCakeFilling_B_fkey" FOREIGN KEY ("B") REFERENCES "MasterCakeFilling"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CakeToMasterCakeCream" ADD CONSTRAINT "_CakeToMasterCakeCream_A_fkey" FOREIGN KEY ("A") REFERENCES "Cake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CakeToMasterCakeCream" ADD CONSTRAINT "_CakeToMasterCakeCream_B_fkey" FOREIGN KEY ("B") REFERENCES "MasterCakeCream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CakeToMasterCakeTopEdge" ADD CONSTRAINT "_CakeToMasterCakeTopEdge_A_fkey" FOREIGN KEY ("A") REFERENCES "Cake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CakeToMasterCakeTopEdge" ADD CONSTRAINT "_CakeToMasterCakeTopEdge_B_fkey" FOREIGN KEY ("B") REFERENCES "MasterCakeTopEdge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CakeToMasterCakeBottomEdge" ADD CONSTRAINT "_CakeToMasterCakeBottomEdge_A_fkey" FOREIGN KEY ("A") REFERENCES "Cake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CakeToMasterCakeBottomEdge" ADD CONSTRAINT "_CakeToMasterCakeBottomEdge_B_fkey" FOREIGN KEY ("B") REFERENCES "MasterCakeBottomEdge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CakeToMasterCakeDecoration" ADD CONSTRAINT "_CakeToMasterCakeDecoration_A_fkey" FOREIGN KEY ("A") REFERENCES "Cake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CakeToMasterCakeDecoration" ADD CONSTRAINT "_CakeToMasterCakeDecoration_B_fkey" FOREIGN KEY ("B") REFERENCES "MasterCakeDecoration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CakeToMasterCakeSurface" ADD CONSTRAINT "_CakeToMasterCakeSurface_A_fkey" FOREIGN KEY ("A") REFERENCES "Cake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CakeToMasterCakeSurface" ADD CONSTRAINT "_CakeToMasterCakeSurface_B_fkey" FOREIGN KEY ("B") REFERENCES "MasterCakeSurface"("id") ON DELETE CASCADE ON UPDATE CASCADE;
