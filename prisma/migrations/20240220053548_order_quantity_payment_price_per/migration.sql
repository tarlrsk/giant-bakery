/*
  Warnings:

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
  - Added the required column `userId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'PROMPTPAY');

-- DropIndex
DROP INDEX "Order_userId_key";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentType" "PaymentType" NOT NULL;

-- AlterTable
ALTER TABLE "OrderCustomerCake" DROP COLUMN "qty",
ADD COLUMN     "pricePer" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "OrderRefreshment" DROP COLUMN "qty",
ADD COLUMN     "pricePer" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "OrderSnackBox" DROP COLUMN "qty",
ADD COLUMN     "pricePer" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "OrderSnackBoxRefreshment" DROP COLUMN "quantity";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "provider",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "PaymentMethod" NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
