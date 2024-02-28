/*
  Warnings:

  - You are about to drop the column `unitRatio` on the `OrderRefreshment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "isCancelled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "OrderRefreshment" DROP COLUMN "unitRatio",
ADD COLUMN     "qtyPerUnit" INTEGER NOT NULL DEFAULT 1;
