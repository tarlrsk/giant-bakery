/*
  Warnings:

  - You are about to drop the column `description` on the `Cake` table. All the data in the column will be lost.
  - The primary key for the `SnackBox` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `_id` on the `SnackBox` table. All the data in the column will be lost.
  - The required column `id` was added to the `SnackBox` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_snackBoxId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_snackBoxId_fkey";

-- DropForeignKey
ALTER TABLE "Refreshment" DROP CONSTRAINT "Refreshment_snackBoxId_fkey";

-- AlterTable
ALTER TABLE "Cake" DROP COLUMN "description",
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "remark" TEXT,
ADD COLUMN     "unitTypeId" TEXT;

-- AlterTable
ALTER TABLE "Refreshment" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "remark" TEXT,
ADD COLUMN     "unitTypeId" TEXT;

-- AlterTable
ALTER TABLE "SnackBox" DROP CONSTRAINT "SnackBox_pkey",
DROP COLUMN "_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "SnackBox_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "UnitType" (
    "id" TEXT NOT NULL,
    "name_th" TEXT NOT NULL,

    CONSTRAINT "UnitType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_snackBoxId_fkey" FOREIGN KEY ("snackBoxId") REFERENCES "SnackBox"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cake" ADD CONSTRAINT "Cake_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "UnitType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refreshment" ADD CONSTRAINT "Refreshment_snackBoxId_fkey" FOREIGN KEY ("snackBoxId") REFERENCES "SnackBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refreshment" ADD CONSTRAINT "Refreshment_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "UnitType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_snackBoxId_fkey" FOREIGN KEY ("snackBoxId") REFERENCES "SnackBox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
