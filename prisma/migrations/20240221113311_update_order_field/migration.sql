/*
  Warnings:

  - The values [PENDING_PAYMENT] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `delivery` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `receivedVia` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `orderCustomerCake` on the `OrderCustomerCake` table. All the data in the column will be lost.
  - You are about to drop the column `qty` on the `OrderCustomerCake` table. All the data in the column will be lost.
  - You are about to drop the column `qty` on the `OrderRefreshment` table. All the data in the column will be lost.
  - You are about to drop the column `qty` on the `OrderSnackBox` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `OrderSnackBoxRefreshment` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `paymentType` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePer` to the `OrderCustomerCake` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePer` to the `OrderRefreshment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePer` to the `OrderSnackBox` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `OrderSnackBox` table without a default value. This is not possible if the table is not empty.
  - Made the column `orderSnackBoxId` on table `OrderSnackBoxRefreshment` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'PROMPTPAY');

-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING_PAYMENT1', 'PENDING_ORDER', 'ON_PROCESS', 'PENDING_PAYMENT2', 'PENDING_DELIVERY', 'COMPLETED', 'CANCELLED');
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "OrderCustomerCake" DROP CONSTRAINT "OrderCustomerCake_cakeId_fkey";

-- DropForeignKey
ALTER TABLE "OrderCustomerCake" DROP CONSTRAINT "OrderCustomerCake_customerCakeId_fkey";

-- DropForeignKey
ALTER TABLE "OrderCustomerCake" DROP CONSTRAINT "OrderCustomerCake_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderRefreshment" DROP CONSTRAINT "OrderRefreshment_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderSnackBox" DROP CONSTRAINT "OrderSnackBox_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderSnackBoxRefreshment" DROP CONSTRAINT "OrderSnackBoxRefreshment_orderSnackBoxId_fkey";

-- DropIndex
DROP INDEX "Order_userId_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "delivery",
DROP COLUMN "receivedVia",
ADD COLUMN     "paymentType" "PaymentType" NOT NULL;

-- AlterTable
ALTER TABLE "OrderCustomerCake" DROP COLUMN "orderCustomerCake",
DROP COLUMN "qty",
ADD COLUMN     "pricePer" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "cakeId" DROP NOT NULL,
ALTER COLUMN "customerCakeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OrderRefreshment" DROP COLUMN "qty",
ADD COLUMN     "pricePer" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "refreshmentId" TEXT,
ADD COLUMN     "unitRatio" INTEGER;

-- AlterTable
ALTER TABLE "OrderSnackBox" DROP COLUMN "qty",
ADD COLUMN     "pricePer" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "snackBoxId" TEXT;

-- AlterTable
ALTER TABLE "OrderSnackBoxRefreshment" DROP COLUMN "quantity",
ADD COLUMN     "refreshmentId" TEXT,
ADD COLUMN     "unitRatio" INTEGER,
ALTER COLUMN "orderSnackBoxId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "provider",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "PaymentMethod" NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderCustomerCake" ADD CONSTRAINT "OrderCustomerCake_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderCustomerCake" ADD CONSTRAINT "OrderCustomerCake_cakeId_fkey" FOREIGN KEY ("cakeId") REFERENCES "Cake"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderCustomerCake" ADD CONSTRAINT "OrderCustomerCake_customerCakeId_fkey" FOREIGN KEY ("customerCakeId") REFERENCES "CustomerCake"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderRefreshment" ADD CONSTRAINT "OrderRefreshment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderRefreshment" ADD CONSTRAINT "OrderRefreshment_refreshmentId_fkey" FOREIGN KEY ("refreshmentId") REFERENCES "Refreshment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderSnackBox" ADD CONSTRAINT "OrderSnackBox_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderSnackBox" ADD CONSTRAINT "OrderSnackBox_snackBoxId_fkey" FOREIGN KEY ("snackBoxId") REFERENCES "SnackBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderSnackBoxRefreshment" ADD CONSTRAINT "OrderSnackBoxRefreshment_orderSnackBoxId_fkey" FOREIGN KEY ("orderSnackBoxId") REFERENCES "OrderSnackBox"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderSnackBoxRefreshment" ADD CONSTRAINT "OrderSnackBoxRefreshment_refreshmentId_fkey" FOREIGN KEY ("refreshmentId") REFERENCES "Refreshment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
