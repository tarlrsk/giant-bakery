/*
  Warnings:

  - You are about to drop the column `discountId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `length` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cFirstName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cLastName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountPrice` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postcode` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingFee` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subTotalPrice` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subdistrict` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "RefreshmentCategory" ADD VALUE 'PRESET_SNACK_BOX';

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_discountId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_cakeId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_customCakeId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_snackBoxId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_snackId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "discountId",
DROP COLUMN "height",
DROP COLUMN "length",
DROP COLUMN "paymentId",
DROP COLUMN "price",
DROP COLUMN "weight",
DROP COLUMN "width",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "cFirstName" TEXT NOT NULL,
ADD COLUMN     "cLastName" TEXT NOT NULL,
ADD COLUMN     "discountPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "district" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "postcode" TEXT NOT NULL,
ADD COLUMN     "province" TEXT NOT NULL,
ADD COLUMN     "remark" TEXT,
ADD COLUMN     "shippingFee" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "subTotalPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "subdistrict" TEXT NOT NULL,
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "orderId" TEXT NOT NULL;

-- DropTable
DROP TABLE "OrderItem";

-- CreateTable
CREATE TABLE "OrderPresetCake" (
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
    "unitTypeId" TEXT,

    CONSTRAINT "OrderPresetCake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderCustomCake" (
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
    "customCakeId" TEXT NOT NULL,
    "unitTypeId" TEXT,

    CONSTRAINT "OrderCustomCake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderRefreshment" (
    "id" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "remark" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "imageFileName" TEXT,
    "imagePath" TEXT,
    "image" TEXT,
    "type" "RefreshmentType" NOT NULL,
    "category" "RefreshmentCategory",
    "weight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "orderId" TEXT NOT NULL,
    "unitTypeId" TEXT,

    CONSTRAINT "OrderRefreshment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderSnackBox" (
    "id" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "packageType" "SnackBoxPackageType" NOT NULL DEFAULT 'SNACK_BOX_S',
    "beverage" "SnackBoxBeverage" NOT NULL DEFAULT 'NONE',

    CONSTRAINT "OrderSnackBox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderSnackBoxRefreshment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "remark" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "imageFileName" TEXT,
    "imagePath" TEXT,
    "image" TEXT,
    "type" "RefreshmentType" NOT NULL,
    "category" "RefreshmentCategory",
    "weight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "orderSnackBoxId" TEXT,
    "unitTypeId" TEXT,

    CONSTRAINT "OrderSnackBoxRefreshment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrderPresetCakeToVariant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_OrderCustomCakeToVariant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DiscountToOrder" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrderPresetCakeToVariant_AB_unique" ON "_OrderPresetCakeToVariant"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderPresetCakeToVariant_B_index" ON "_OrderPresetCakeToVariant"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrderCustomCakeToVariant_AB_unique" ON "_OrderCustomCakeToVariant"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderCustomCakeToVariant_B_index" ON "_OrderCustomCakeToVariant"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DiscountToOrder_AB_unique" ON "_DiscountToOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_DiscountToOrder_B_index" ON "_DiscountToOrder"("B");

-- AddForeignKey
ALTER TABLE "OrderPresetCake" ADD CONSTRAINT "OrderPresetCake_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderPresetCake" ADD CONSTRAINT "OrderPresetCake_cakeId_fkey" FOREIGN KEY ("cakeId") REFERENCES "Cake"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderPresetCake" ADD CONSTRAINT "OrderPresetCake_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "UnitType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderCustomCake" ADD CONSTRAINT "OrderCustomCake_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderCustomCake" ADD CONSTRAINT "OrderCustomCake_customCakeId_fkey" FOREIGN KEY ("customCakeId") REFERENCES "CustomCake"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderCustomCake" ADD CONSTRAINT "OrderCustomCake_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "UnitType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderRefreshment" ADD CONSTRAINT "OrderRefreshment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderRefreshment" ADD CONSTRAINT "OrderRefreshment_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "UnitType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderSnackBoxRefreshment" ADD CONSTRAINT "OrderSnackBoxRefreshment_orderSnackBoxId_fkey" FOREIGN KEY ("orderSnackBoxId") REFERENCES "OrderSnackBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderSnackBoxRefreshment" ADD CONSTRAINT "OrderSnackBoxRefreshment_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "UnitType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderPresetCakeToVariant" ADD CONSTRAINT "_OrderPresetCakeToVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "OrderPresetCake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderPresetCakeToVariant" ADD CONSTRAINT "_OrderPresetCakeToVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderCustomCakeToVariant" ADD CONSTRAINT "_OrderCustomCakeToVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "OrderCustomCake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderCustomCakeToVariant" ADD CONSTRAINT "_OrderCustomCakeToVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscountToOrder" ADD CONSTRAINT "_DiscountToOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "Discount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscountToOrder" ADD CONSTRAINT "_DiscountToOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
