/*
  Warnings:

  - You are about to drop the column `type` on the `CustomCake` table. All the data in the column will be lost.
  - You are about to drop the `_CakeToCart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CartToCustomCake` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CartToRefreshment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CartToSnackBox` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Cart` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `cakeId` to the `CustomCake` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CakeToCart" DROP CONSTRAINT "_CakeToCart_A_fkey";

-- DropForeignKey
ALTER TABLE "_CakeToCart" DROP CONSTRAINT "_CakeToCart_B_fkey";

-- DropForeignKey
ALTER TABLE "_CartToCustomCake" DROP CONSTRAINT "_CartToCustomCake_A_fkey";

-- DropForeignKey
ALTER TABLE "_CartToCustomCake" DROP CONSTRAINT "_CartToCustomCake_B_fkey";

-- DropForeignKey
ALTER TABLE "_CartToRefreshment" DROP CONSTRAINT "_CartToRefreshment_A_fkey";

-- DropForeignKey
ALTER TABLE "_CartToRefreshment" DROP CONSTRAINT "_CartToRefreshment_B_fkey";

-- DropForeignKey
ALTER TABLE "_CartToSnackBox" DROP CONSTRAINT "_CartToSnackBox_A_fkey";

-- DropForeignKey
ALTER TABLE "_CartToSnackBox" DROP CONSTRAINT "_CartToSnackBox_B_fkey";

-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "CustomCake" DROP COLUMN "type",
ADD COLUMN     "cakeId" TEXT NOT NULL,
ALTER COLUMN "isActive" SET DEFAULT true;

-- DropTable
DROP TABLE "_CakeToCart";

-- DropTable
DROP TABLE "_CartToCustomCake";

-- DropTable
DROP TABLE "_CartToRefreshment";

-- DropTable
DROP TABLE "_CartToSnackBox";

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "type" "CartItemType" NOT NULL,
    "presetCakesId" TEXT,
    "customCakeId" TEXT,
    "refreshmentId" TEXT,
    "snackBoxId" TEXT,
    "cartId" TEXT NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_customCakeId_key" ON "CartItem"("customCakeId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_refreshmentId_key" ON "CartItem"("refreshmentId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_snackBoxId_key" ON "CartItem"("snackBoxId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_presetCakesId_fkey" FOREIGN KEY ("presetCakesId") REFERENCES "Cake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_customCakeId_fkey" FOREIGN KEY ("customCakeId") REFERENCES "CustomCake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_refreshmentId_fkey" FOREIGN KEY ("refreshmentId") REFERENCES "Refreshment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_snackBoxId_fkey" FOREIGN KEY ("snackBoxId") REFERENCES "SnackBox"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomCake" ADD CONSTRAINT "CustomCake_cakeId_fkey" FOREIGN KEY ("cakeId") REFERENCES "Cake"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
